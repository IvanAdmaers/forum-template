const TokenService = require('../services/TokenService');
const CookieService = require('../services/CookieService');

exports.request = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    const tokenPayload = { userId, type };

    const token = TokenService.createSocketRequestToken(tokenPayload);

    CookieService.setRequestSocketConnectionToken(res, token);

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
