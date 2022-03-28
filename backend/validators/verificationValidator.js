const { check, validationResult } = require('express-validator');
const GroupService = require('../services/GroupService');

const UserService = require('../services/UserService');
const VerificationService = require('../services/VerificationService');

const { isValidObjectId } = require('../utills');

const verificationValidator = [
  check('verification.type')
    .not()
    .isEmpty()
    .withMessage('Verification type cannot be empty')
    .bail()

    .isString()
    .withMessage('Verification type must be a string')
    .bail()

    .custom((type) => {
      const availableTypes = ['user', 'group'];

      if (!availableTypes.includes(type)) {
        throw new Error('Verification type is unknown');
      }

      return true;
    })
    .bail(),
  check('verification.id')
    .not()
    .isEmpty()
    .withMessage('Verification id cannot be empty')
    .bail()

    .isString()
    .withMessage('Verification id must be a string')
    .bail()

    .custom(async (id, { req }) => {
      const isValid = isValidObjectId(id);

      if (!isValid) {
        throw new Error('Verification id is invalid');
      }

      // Check user or group exists
      const { type } = req.body.verification;

      const Service = type === 'user' ? UserService : GroupService;

      const isExists = await Service.findById(id, '_id');

      if (!isExists) {
        throw new Error(`Could not find ${type}`);
      }

      // Get user or group verification status
      const hasVerification = await VerificationService.hasVerification(
        type,
        id
      );

      // Check action and verification status
      const { action } = req.params;

      if (
        (action === 'add' && hasVerification) ||
        (action === 'remove' && !hasVerification)
      ) {
        throw new Error('Verification conflict');
      }

      return true;
    }),
  check('verification.message')
    .optional()

    .isString()
    .withMessage('Message must be a string')
    .bail()

    .trim()

    .isLength({ min: 3, max: 500 })
    .withMessage('Message must has min 3 and max 500 charsets')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = verificationValidator;
