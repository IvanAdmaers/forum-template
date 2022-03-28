const { query, validationResult } = require('express-validator');

const availableChatTypes = ['global', 'private-chats', 'personal'];

const requestSocketConnectionValidator = [
  query('type').custom((chatType) => {
    const exists = availableChatTypes.includes(chatType);

    if (!exists) {
      throw new Error('Chat type is unknown');
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

module.exports = requestSocketConnectionValidator;
