const { check, validationResult } = require('express-validator');

const postValidator = [
  check('post.title')
    .exists()
    .withMessage('Title cannot be empty')

    .isString()
    .withMessage('Title must be a string')

    .trim()
    .not()
    .isEmpty()
    .withMessage('Title cannot be empty')
    .bail()

    .isLength({ min: 2 })
    .withMessage('Minimum 2 characters in title')
    .bail()

    .isLength({ max: 299 })
    .withMessage('Maximum 299 characters in title')
    .bail(),
  check('post.body')
    .exists()
    .withMessage('Post body cannot be empty')

    .isObject()
    .withMessage('Body must has a string type')

    .not()
    .isEmpty()
    .withMessage('Post body cannot be empty'),
  check('post.body.blocks')
    .exists()
    .withMessage('Post body blocks cannot be empty')

    .isArray({ min: 1 })
    .withMessage('Post body blocks must be an array'),
  check('post.groupId')
    .exists()
    .withMessage('Missed groupId')

    .isString()
    .withMessage('groupId must be a string')
    .bail()

    .not()
    .isEmpty()
    .withMessage('groupId can not be empty')
    .bail(),
  check('post.isNSFW')
    .isBoolean()
    .withMessage('isNSFW must has a boolean type')
    .bail(),
  check('post.sendReplies')
    .isBoolean()
    .withMessage('sendReplies must has a boolean type')
    .bail(),
  check('post.isOriginalContent')
    .isBoolean()
    .withMessage('isOriginalContent must has a boolean type')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = postValidator;
