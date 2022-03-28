const { check, validationResult } = require('express-validator');

const userValidator = [
  check('user.password')
    .not()
    .isEmpty()
    .withMessage('Password cannot be empty')
    .bail()

    .isLength({ max: 128 })
    .withMessage('Maximum 128 characters in password')
    .bail()

    .isStrongPassword({ minSymbols: 0 })
    .withMessage(
      'The password must be strong, > 8 characters. Those. contain at least: 1 uppercase character, lowercase character, 1 number. Preferably a special character (e.g. -, _, !, =, #, etc.)'
    )
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = userValidator;
