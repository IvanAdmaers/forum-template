const ApiError = require('../exceptions/ApiError');
const TokenService = require('../services/TokenService');
const MailService = require('../services/MailService');
const ConfirmationCodesService = require('../services/ConfirmationCodesService');
const UserService = require('../services/UserService');

const { DateDifference } = require('../utills');

exports.confirmation = async (req, res, next) => {
  try {
    const { token } = req.body;

    const { error, token: tokenInfo } = TokenService.verify(token);

    if (error) {
      return next(ApiError.unprocessableEntity('Token is incorrect'));
    }

    const { userId, code } = tokenInfo;

    const { error: confirmationError } = await MailService.emailConfirmation(
      userId,
      code
    );

    if (confirmationError) {
      return next(
        ApiError.unprocessableEntity(
          'Confirmation error. Probably the mail has already been confirmed before or the confirmation code has expired'
        )
      );
    }

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};

exports.resend = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { email } = await UserService.findById(userId);

    const { error, date } =
      await ConfirmationCodesService.getLastEmailConfirmationRequestDate(
        userId
      );

    if (error) {
      return next(ApiError.badRequest(error));
    }

    const dateDifference = DateDifference.inMinutes(new Date(), new Date(date));

    if (dateDifference < 1) {
      return next(ApiError.badRequest('Try again later'));
    }

    const { token, code } = TokenService.createEmailConfirmationData(userId);

    MailService.createEmailConfirmation(userId, code);

    const confirmationLink = `${process.env.CLIENT_URL}/email/${token}`;

    await MailService.sendConfirmationMail(email, confirmationLink);

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
