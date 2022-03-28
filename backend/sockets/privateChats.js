const {
  getChats,
  getChatMessages,
  addMessage,
  chatRead,
} = require('./controllers/privateChatsController');

const { findSocketsByUserIdInNamespaces } = require('./libs');

const { connectionMiddleware } = require('./middlewares');

const privateChats = (io, privateChatsNamespace, personalNamespaceName) => {
  privateChatsNamespace.use(connectionMiddleware());

  const findSocketAndTrigger = async (userId = '', personalOnly = false) => {
    const namespaces = [personalNamespaceName];

    if (!personalOnly) {
      namespaces.push(privateChatsNamespace.name);
    }

    const userSockets = await findSocketsByUserIdInNamespaces(
      io,
      namespaces,
      userId
    );

    userSockets.forEach((socket) => {
      socket.emit('chats:update');
    });

    return true;
  };

  privateChatsNamespace.on('connection', async (socket) => {
    let currentChatId = '';

    const { userId } = socket.request;

    socket.on('chat:list', async () => {
      const chats = await getChats(userId);
      socket.emit('chat:list', chats);
    });

    // Request chat data
    socket.on('chat:request', async (chatInterlocutorId = '') => {
      const { messages, chatId } = await getChatMessages(
        chatInterlocutorId,
        userId
      );

      if (!messages) {
        return socket.emit('chat:messages', []);
      }

      await findSocketAndTrigger(userId, true);

      // TODO: If we have no chat id there is an issue
      currentChatId = chatId;

      socket.join(currentChatId);

      return privateChatsNamespace
        .in(currentChatId)
        .emit('chat:messages', messages);
    });

    // Handle a new message
    socket.on(
      'message:add',
      async (interlocutorId = '', text = '', replyToId = null) => {
        try {
          const { message, chatId } = await addMessage(
            socket,
            interlocutorId,
            userId,
            text,
            replyToId
          );

          await findSocketAndTrigger(interlocutorId);

          // is this ok? the user might be already connected to a room
          // but we're trying to connect him again becouse if it's
          // a new chat we must have a connection
          socket.join(chatId);

          return privateChatsNamespace.in(chatId).emit('message:new', message);
        } catch (error) {
          console.log(error);
          return socket.emit('error', 'Something wrong');
        }
      }
    );

    // Handle chat read
    socket.on('chat:read', async (interlocutorId = '') => {
      try {
        await chatRead(socket, interlocutorId, userId);

        return true;
      } catch (error) {
        console.log(error);
        return socket.emit('error', 'Something is wrong');
      }
    });

    // Leave from room
    socket.on('chat:leave', () => {
      socket.leave(currentChatId);
    });
  });
};

module.exports = privateChats;
