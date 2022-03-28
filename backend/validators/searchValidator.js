const { query, validationResult } = require('express-validator');

const searchQueryLength = {
  min: 1,
  max: 200,
};

const searchValidator = [
  query('q')
    .exists()
    .withMessage('Search param q must exists')
    .bail()

    .trim()

    .isLength({ min: searchQueryLength.min, max: searchQueryLength.max })
    .withMessage(
      `Search query must has min ${searchQueryLength.min} and max ${searchQueryLength.max} charsets`
    )
    .bail(),
  query('by')
    .exists()
    .withMessage('Search param by must exists')
    .bail()

    .isIn(['users', 'posts', 'groups'])
    .withMessage('Search param by has incorrect value')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = searchValidator;
