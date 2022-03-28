const { check, validationResult } = require('express-validator');
const verifier = require('captcha-verifier');

const getVerifyMethod = (type = '') => {
  if (type === 'reCaptchaV2') {
    return verifier.reCaptchaV2;
  }

  throw new Error('Captcha type is unknown');
};

const captchaTokenValidator = (type = '', property = '') => [
  check(property)
    .trim()
    .not()
    .isEmpty()
    .withMessage('Token cannot be empty')
    .bail()

    .custom(async (token, { req }) => {
      const verify = getVerifyMethod(type);

      const [success] = await verify(token, req.clientIp);

      if (!success) {
        throw new Error('Captcha was not solved');
      }

      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = captchaTokenValidator;
