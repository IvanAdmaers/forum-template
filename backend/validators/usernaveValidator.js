const { body, check, validationResult } = require('express-validator');

const UserService = require('../services/UserService');
const PremiumUsernameService = require('../services/PremiumUsernameService');

const usernameValidator = [
  check('user.username')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Username cannot be empty')
    .bail()

    .isLength({ min: 3 })
    .withMessage('Username cannot be shorter than 3 characters')
    .bail()

    .isLength({ max: 20 })
    .withMessage('Username cannot be longer than 20 characters')
    .bail()

    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage('Allowed symbols A-z, 0-9 and -')
    .bail(),

  body('user.username').custom((value, { req }) => {
    if (value === req.body.user.email) {
      throw new Error('Email and Username cannot be the same');
    }

    const regexs = [/admin/i, /boss/i, /support/i, /nugger/i, /account/i];

    for (let i = 0; i < regexs.length; i += 1) {
      const regex = regexs[i];

      const regexText = `${regex}`.split('/')[1];

      if (value.match(regex)) {
        throw new Error(`Username cannot contain a word ${regexText}`);
      }
    }

    return true;
  }),

  // eslint-disable-next-line arrow-body-style
  body('user.username').custom(async (username) => {
    const isExists = await UserService.findByUsername(username);

    if (isExists) {
      throw new Error('Username already in use');
    }

    const isPremium = await PremiumUsernameService.exists('username', username);

    if (isPremium) {
      throw new Error('This is a premium username');
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

module.exports = usernameValidator;
