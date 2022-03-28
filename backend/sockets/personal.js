const { getChats } = require('./controllers/privateChatsController');

const { connectionMiddleware } = require('./middlewares');

const getUnreadChats = (chats = []) => {
  const result = [];

  chats.forEach((chat) => {
    if (!chat.hasUnreadMessages) {
      return;
    }

    result.push(chat.interlocutor.id);
  });

  return result;
};

const personal = (personalNamespace) => {
  personalNamespace.use(connectionMiddleware());

  personalNamespace.on('connection', (socket) => {
    const { userId } = socket.request;

    socket.on('chats:unread', async () => {
      const chats = await getChats(userId);

      const unreadChats = await getUnreadChats(chats);
      socket.emit('chats:unread', unreadChats);
    });
  });
};

module.exports = personal;
