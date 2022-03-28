const { check, validationResult } = require('express-validator');

const commentValidator = [
  check('comment.parentId')
    .exists()
    .withMessage('Comment parendId cannot be empty')
    .bail(),

  check('comment.body.blocks')
    .not()
    .isEmpty()
    .withMessage('Comment body cannot be empty')
    .bail()

    .isArray()
    .withMessage('Body blocks must be an array')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = commentValidator;
