const TokenService = require('../../services/TokenService');

const { CONNECTION_TOKEN_COOKIE_NAME } = require('../../constants/sockets');

const getCookiesObject = (cookiesString) =>
  cookiesString.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=').map((c) => c.trim());
    cookies[name] = value;
    return cookies;
  }, {});

const errorText = 'Security error';

const connectionMiddleware = () => (socket, next) => {
  try {
    const cookies = getCookiesObject(socket.handshake.headers.cookie || '');

    const connectionToken = cookies[CONNECTION_TOKEN_COOKIE_NAME];

    // Check token exists
    if (!connectionToken) {
      return next(new Error(errorText));
    }

    const { error, token } = TokenService.verify(connectionToken);

    // Check does the token correct
    if (error) {
      return next(new Error(errorText));
    }

    // Because of we have only a global chat now
    // We don't check such token params like
    // Type or chatId

    const { type, chatId, userId } = token;

    socket.request.userId = userId;
    socket.request.token = { type, chatId };

    return next();
  } catch (e) {
    console.log(e);
    return next(new Error(errorText));
  }
};

module.exports = connectionMiddleware;
