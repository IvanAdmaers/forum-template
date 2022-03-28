const { check, validationResult } = require('express-validator');

const UserService = require('../services/UserService');
const GroupService = require('../services/GroupService');

const { isValidObjectId } = require('../utills');
const { getBanInfo } = require('../controllers/utills');

const minBanDuration = 1;
const maxBanDuration = 99999;

const minBanReason = 3;
const maxBanReason = 1000;

const banValidator = [
  check('ban.type')
    .exists()
    .withMessage('Ban type cannot be empty')
    .bail()

    .isString()
    .withMessage('Ban type must be a string')
    .bail()

    .custom((type) => {
      const availableTypes = ['user', 'group'];

      const isAvailable = availableTypes.includes(type);

      if (!isAvailable) {
        throw new Error('Ban type is unknown');
      }

      return true;
    }),
  check('ban.id')
    .exists()
    .withMessage('Ban id cannot be empty')
    .bail()

    .isString()
    .withMessage('Ban id must be a string')
    .bail()

    .custom(async (id, { req }) => {
      const isValid = isValidObjectId(id);

      if (!isValid) {
        throw new Error('Ban id is not correct');
      }

      const isUser = req.body.ban.type === 'user';

      const Service = isUser ? UserService : GroupService;

      const exists = await Service.findById(id);

      if (!exists) {
        throw new Error('Ban id is incorrect');
      }

      // Check if group have an active ban
      if (!isUser) {
        const group = exists;
        const groupBansLength = group.bans.length;

        if (groupBansLength) {
          const lastBan = group.bans[groupBansLength - 1].toString();

          const { status } = await getBanInfo(lastBan);

          if (status) {
            throw new Error('Group already has an active ban');
          }
        }
      }

      return true;
    }),
  check('ban.duration')
    .optional()

    .isFloat({ min: minBanDuration, max: maxBanDuration })
    .withMessage(
      `Ban duration must be a number more than ${minBanDuration} and no more than ${maxBanDuration}`
    )
    .bail()

    .custom((_, { req }) => {
      const { type } = req.body.ban;

      if (type === 'group') {
        throw new Error(
          'Groups support only permament ban without time duration'
        );
      }

      return true;
    }),
  check('ban.reason')
    .exists()
    .withMessage('Ban reason cannot be empty')
    .bail()

    .isString()
    .withMessage('Ban reason must be a string')
    .bail()

    .trim()

    .isLength({ min: minBanReason, max: maxBanReason })
    .withMessage(
      `Ban reason must be at least ${minBanReason} and no more than ${maxBanReason} symbols`
    )
    .bail(),
  check('ban.insideComment')
    .optional()

    .isString()
    .withMessage('Ban inside comment must be a string')
    .bail()

    .trim()

    .isLength({ min: minBanReason, max: maxBanReason })
    .withMessage(
      `Ban reason must be at least ${minBanReason} and no more than ${maxBanReason} symbols`
    )
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = banValidator;
