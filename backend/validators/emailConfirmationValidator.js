const { check, validationResult } = require('express-validator');

const userValidator = [
  check('token')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Token cannot be empty')
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
