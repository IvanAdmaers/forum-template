const { body, validationResult } = require('express-validator');

const ComplaintService = require('../services/ComplaintService');

const { isValidObjectId } = require('../utills');

const complaintDecisionValidator = [
  body('decision.block')
    .isBoolean()
    .withMessage('Decision block must be a boolean')
    .bail(),
  body('decision.id')
    .isString()
    .withMessage('Decision id must be a string')
    .bail()
    .custom(async (id) => {
      const isValid = isValidObjectId(id);

      if (!isValid) {
        throw new Error('Decision id is invalid');
      }

      const exists = await ComplaintService.get(id);

      if (!exists) {
        throw new Error('Decision id is incorrect');
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

module.exports = complaintDecisionValidator;
