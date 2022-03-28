const BanService = require('../services/BanService');

const { triggerSocketEvent } = require('./helpers');
const { SOCKET_USER_DISCONNECT_EVENT } = require('../constants/sockets');

const socketUserDisconnectEvent = (req, userId = '') => {
  triggerSocketEvent(req, SOCKET_USER_DISCONNECT_EVENT, userId);
};

exports.ban = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type, id, duration, reason, insideComment } = req.body.ban;

    // Disconnect user sockets
    socketUserDisconnectEvent(req, userId);

    await BanService.toBan(type, id, duration, userId, reason, insideComment);

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
