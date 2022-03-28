const { param, validationResult } = require('express-validator');

const ChatService = require('../services/ChatService');

const { isValidObjectId } = require('../utills');

/**
 CHECKS:
  * check is chat id valid
  * check does chat exist
  * if chat type is public check is the user group member
  * if chat type is private check does the user include in chat members
  we have only global chats now thats because some of these checks
  does not implement now
*/

const getChatMessages = [
  param('id').custom(async (chatId) => {
    const isValid = isValidObjectId(chatId);

    if (!isValid) {
      throw new Error('Chat id param is incorrect');
    }

    const exists = await ChatService.exists(chatId);

    if (!exists) {
      throw new Error('Chat does not exist');
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

module.exports = getChatMessages;
