const { findSocketsByUserIdInNamespaces } = require('../libs');

let io = null;

const userDisonnectEvent = (socketIO = {}, socketNamespaces = []) => {
  io = socketIO;

  return async (userId = '') => {
    const userSockets = await findSocketsByUserIdInNamespaces(
      io,
      socketNamespaces,
      userId
    );

    userSockets.forEach((socket) => socket.disconnect(true));

    return true;
  };
};

module.exports = userDisonnectEvent;
