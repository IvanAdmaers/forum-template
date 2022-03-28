const ApiError = require('../exceptions/ApiError');
const RiskService = require('../services/RiskService');
const UserService = require('../services/UserService');
const TokenService = require('../services/TokenService');
const MailService = require('../services/MailService');
const ConfirmationCodesService = require('../services/ConfirmationCodesService');
const LogService = require('../services/LogService');
const CookieService = require('../services/CookieService');

const { triggerSocketEvent } = require('./helpers');
const { SOCKET_USER_DISCONNECT_EVENT } = require('../constants/sockets');

exports.requestReset = async (req, res, next) => {
  try {
    const actionType = 'reset-password';

    const { clientIp, userAgent } = req;
    const email = req.body?.user?.email?.trim()?.toLowerCase();

    const fixRiskAction = async () => {
      await RiskService.add(clientIp, actionType, userAgent);

      return true;
    };

    if (!email) {
      return next(ApiError.badRequest('Email not defined'));
    }

    const shouldLetAction = await RiskService.shouldLetAction(
      clientIp,
      actionType
    );

    if (!shouldLetAction) {
      return next(ApiError.badRequest('Try again later'));
    }

    // Check user exists
    const user = await UserService.findByEmail(email);

    if (!user) {
      await fixRiskAction();
      return res.json({ success: true });
    }

    // Generate code and jwt token
    const { token, code } = TokenService.createResetPasswordData(user._id);

    // Save code to DB
    await ConfirmationCodesService.addResetPasswordConfirmationCode(
      user._id,
      code
    );

    // Send mail
    const clientUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

    await MailService.sendResetPasswordMail(user.email, clientUrl);

    // Risk service
    await fixRiskAction();

    // Log action
    await LogService.action(
      user._id,
      'reset-password-attempt',
      clientIp,
      userAgent
    );

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};

exports.reset = async (req, res, next) => {
  try {
    const { clientIp, userAgent } = req;
    const { token } = req.body;
    const { password } = req.body.user;

    // Check is token valid
    const isTokenValid = TokenService.verify(token);

    if (isTokenValid.error) {
      return next(ApiError.badRequest('token is incorrect'));
    }

    const { code, userId } = isTokenValid.token;

    const { error } = await ConfirmationCodesService.makeConfirmation(
      userId,
      code,
      'reset-password'
    );

    if (error) {
      return next(ApiError.badRequest(error));
    }

    // Delete all refresh tokens
    await TokenService.deleteAllRefreshTokens(userId);

    // Disconnect user sockets
    triggerSocketEvent(req, SOCKET_USER_DISCONNECT_EVENT, userId);

    // Change password
    await UserService.changePassword(userId, password);

    const refreshToken = TokenService.createRefreshToken(userId);

    await TokenService.saveRefreshToken(userId, refreshToken);

    CookieService.setRefreshToken(res, refreshToken);

    await LogService.action(userId, 'password-changed', clientIp, userAgent);

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
