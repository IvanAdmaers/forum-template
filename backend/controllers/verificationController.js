const VerificationService = require('../services/VerificationService');

exports.add = async (req, res, next) => {
  try {
    const verificationBy = req.user.id;
    const { type, id, message } = req.body.verification;

    await VerificationService.add(type, id, verificationBy, message);

    return res.json({ added: true });
  } catch (e) {
    return next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { type, id } = req.body.verification;

    await VerificationService.remove(type, id);

    return res.json({ removed: true });
  } catch (e) {
    return next(e);
  }
};
