const { check, validationResult } = require('express-validator');

const availableTypes = ['global'];

const chatValidator = [
  check('chat.type').custom((type) => {
    if (!availableTypes.includes(type)) {
      throw new Error('Type is unknown');
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

module.exports = chatValidator;
