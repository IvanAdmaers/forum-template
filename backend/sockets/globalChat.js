const ChatService = require('../services/ChatService');
const MessageService = require('../services/MessageService');

const { connectionMiddleware } = require('./middlewares');

const MessageDTO = require('../dtos/MessageDTO');

const { cleanHtml, isValidObjectId } = require('../utills');

let chatId = null;

const getGlobalChatId = async () => {
  const globalChatId = await ChatService.getGlobalChatId();

  if (globalChatId) {
    return globalChatId;
  }

  const createdGlobalChatId = await ChatService.create('global', [], []);

  return createdGlobalChatId;
};

const globalChat = async (globalChatNamespace) => {
  chatId = !chatId ? await getGlobalChatId() : chatId;

  globalChatNamespace.use(connectionMiddleware());

  globalChatNamespace.on('connection', async (socket) => {
    const messagesLimit = 50;
    const messagesCount = await ChatService.getMessagesCount(chatId);

    const skip =
      messagesCount <= messagesLimit ? 0 : messagesCount - messagesLimit;

    const messages = await ChatService.getMessages(chatId, skip, messagesLimit);
    const messagesList = messages.map(
      (message) => new MessageDTO(message, message.author)
    );

    // Send messages list
    socket.emit('messages:list', messagesList);

    // New chat message
    socket.on('messages:new', async (messageData) => {
      try {
        const { message, replyTo = null } = messageData;

        const messageText = cleanHtml(message?.trim());

        if (
          !messageText ||
          !messageText.length ||
          messageText.length < 1 ||
          messageText.length > 200 ||
          (replyTo && !isValidObjectId(replyTo))
        ) {
          return socket.emit('error', 'Something wrong with a sended message');
        }
        // Check reply to message exist
        if (replyTo) {
          const exist = await ChatService.messageExists(chatId, replyTo);

          if (!exist) {
            return socket.emit('error', 'Message to reply does not exist');
          }
        }

        const { userId } = socket.request;

        const newMessage = await MessageService.create(
          userId,
          message,
          replyTo
        );
        await ChatService.addMessage(chatId, newMessage._id);

        return globalChatNamespace.emit(
          'messages:new',
          new MessageDTO(newMessage, newMessage.author)
        );
      } catch (e) {
        return console.log(e);
      }
    });

    // Message complaint
    socket.on('messages:complaint', (id) => {
      console.log('recieve a complaint to the message with id', id);
    });
  });
};

module.exports = globalChat;
