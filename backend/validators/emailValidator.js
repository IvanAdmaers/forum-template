const { body, check, validationResult } = require('express-validator');

const UserService = require('../services/UserService');

const userValidator = [
  check('user.email')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Email cannot be empty')
    .bail()

    .isLength({ min: 3 })
    .withMessage('Minimum 3 characters in email')
    .bail()

    .isEmail()
    .toLowerCase()
    .normalizeEmail()
    .withMessage('Please enter a valid email')
    .bail(),

  // eslint-disable-next-line arrow-body-style
  body('user.email').custom((email) => {
    return UserService.findByEmail(email).then((user) => {
      const isExists = Boolean(user);

      if (isExists) {
        return Promise.reject(new Error('Email already in use'));
      }

      return Promise.resolve();
    });
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = userValidator;
