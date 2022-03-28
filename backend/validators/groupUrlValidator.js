const { body, check, validationResult } = require('express-validator');

const GroupService = require('../services/GroupService');

const groupUrlValidator = [
  check('group.url')
    .isString()
    .withMessage('Url must be an string')
    .bail()

    .trim()
    .toLowerCase()
    .not()
    .isEmpty()
    .withMessage('Url cannot be empty')
    .bail()

    .isLength({ min: 3 })
    .withMessage('Url cannot be shorter than 3 characters')
    .bail()

    .isLength({ max: 20 })
    .withMessage('Url cannot be longer than 20 characters')
    .bail()

    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage('Allowed symbols A-z, 0-9 and _')
    .bail(),

  // eslint-disable-next-line arrow-body-style
  body('group.url').custom((url) => {
    return GroupService.slugExists(url).then((isExists) => {
      if (isExists) {
        return Promise.reject(new Error('Url already in use'));
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

module.exports = groupUrlValidator;
