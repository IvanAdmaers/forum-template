const { check, validationResult } = require('express-validator');

const titleMinLength = 3;
const titleMaxLength = 30;

const tagsMinLength = 1;
const tagsMaxLength = 3;

const descriptionMaxLength = 200;

const createGroupValidator = [
  check('group').exists().isObject().withMessage('Group param is empty').bail(),
  check('group.image')
    .trim()
    .optional()
    .isURL()
    .withMessage('Image must be a link')
    .bail(),
  check('group.title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('The group must have a name')
    .bail(),
  check('group.title')
    .isLength({ min: titleMinLength, max: titleMaxLength })
    .withMessage(
      `Group name must be between ${titleMinLength} and ${titleMaxLength} characters`
    )
    .bail(),
  check('group.tags')
    .isArray({ min: tagsMinLength, max: tagsMaxLength })
    .withMessage('Tags must be an array')
    .withMessage(`Must be between ${tagsMinLength} and ${tagsMaxLength} tags`)
    .bail(),
  check('group.description')
    .trim()
    .optional()
    .isLength({ max: descriptionMaxLength })
    .withMessage(
      `No more than ${descriptionMaxLength} characters in the description`
    )
    .bail(),
  check('group.isNSFW')
    .isBoolean()
    .withMessage('isNSFW must be an boolean')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = createGroupValidator;
