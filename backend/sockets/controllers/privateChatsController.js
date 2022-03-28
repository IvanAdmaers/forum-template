const UserService = require('../../services/UserService');
const ChatService = require('../../services/ChatService');
const MessageService = require('../../services/MessageService');

const MessageDTO = require('../../dtos/MessageDTO');
const AuthorDTO = require('../../dtos/AuthorDto');

const { cleanHtml } = require('../../utills');

const hasUserChat = async (userId = '', chatInterlocutorId = '') => {
  const chatList = await UserService.getChats(userId);
  const chatsInfo = await Promise.all(
    chatList.map((userChatId) => ChatService.getInfo(userChatId, userId))
  );

  const existingChatIdIndex = chatsInfo.findIndex(
    ({ interlocutor }) => interlocutor._id.toString() === chatInterlocutorId
  );

  if (existingChatIdIndex === -1) {
    return null;
  }

  return chatList[existingChatIdIndex]._id.toString();
};

exports.getChats = async (userId = '') => {
  const chatList = await UserService.getChats(userId);

  if (!chatList.length) {
    return [];
  }

  const promises = [];

  chatList.forEach((chat) => promises.push(ChatService.getInfo(chat, userId)));

  const chatInfo = await Promise.all(promises);

  const chatInfoModified = chatInfo.map((chat) => ({
    ...chat,
    lastMessage: new MessageDTO(chat.lastMessage, chat.lastMessage.author),
    interlocutor: new AuthorDTO(chat.interlocutor),
  }));

  const chatInfoSortedByDate = chatInfoModified.sort(
    (a, b) =>
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  );

  const chats = chatList.map((id, index) => ({
    id,
    ...chatInfoSortedByDate[index],
  }));

  return chats;
};

exports.getChatMessages = async (chatInterlocutorId = '', userId = '') => {
  const existingChatId = await hasUserChat(userId, chatInterlocutorId);

  if (!existingChatId) {
    return { messages: null };
  }

  const [messagesList] = await Promise.all([
    ChatService.getMessages(existingChatId, 0, 9999),
    ChatService.markAsRead(existingChatId, userId),
  ]);

  const messages = messagesList.map(
    (message) => new MessageDTO(message, message.author)
  );

  return { messages, chatId: existingChatId };
};

exports.addMessage = async (
  socket,
  interlocutorId = '',
  userId = '',
  text = '',
  replyTo = ''
) => {
  try {
    // Check does current user has the chat
    const existingChatId = await hasUserChat(userId, interlocutorId);

    const messageText = cleanHtml(text);

    if (!messageText || !messageText.length || messageText.length > 500) {
      return socket.emit('error', 'Incorrect message');
    }

    // Check reply to exists
    if (replyTo) {
      if (!existingChatId) {
        return socket.emit('error', 'Chat does not exist');
      }

      const replyToExists = await ChatService.messageExists(
        existingChatId,
        replyTo
      );

      if (!replyToExists) {
        return socket.emit('error', 'Replying message does not exist');
      }
    }

    const promises = [];

    promises.push(MessageService.create(userId, messageText, replyTo));
    promises.push(UserService.findById(userId));

    const [message, author] = await Promise.all(promises);

    const messageId = message._id.toString();

    if (existingChatId) {
      await ChatService.addMessage(existingChatId, messageId);
    }

    let chatId = !existingChatId ? '' : existingChatId;

    if (!existingChatId) {
      chatId = await ChatService.create(
        'private',
        [userId, interlocutorId],
        [messageId]
      );

      await Promise.all([
        UserService.addChat(userId, chatId),
        UserService.addChat(interlocutorId, chatId),
      ]);
    }

    const messageDTO = new MessageDTO(message, author);

    return { message: messageDTO, chatId };
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.chatRead = async (socket, interlocutorId = '', userId = '') => {
  // Check chat exists
  const chatId = await hasUserChat(userId, interlocutorId);

  if (!chatId) {
    return socket.emit('error', 'Chat does not exist');
  }

  await ChatService.markAsRead(chatId, userId);

  return true;
};
