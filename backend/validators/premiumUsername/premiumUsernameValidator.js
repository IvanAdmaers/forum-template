const { check, validationResult } = require('express-validator');

const PremiumUsernameService = require('../../services/PremiumUsernameService');
const UserService = require('../../services/UserService');

const { isUsernameValid } = require('../utills');

const minPrice = 0.1;
const maxPrice = 99999;

const premiumUsernameValidator = [
  check('premiumUsername.username')
    .exists()
    .withMessage('Username cannot be empty')
    .bail()

    .isString()
    .withMessage('Username must be a string')
    .bail()

    .trim()

    .custom(async (username) => {
      // Check is username valid
      const { isValid, message } = isUsernameValid(username);

      if (!isValid) {
        throw new Error(message);
      }

      // Is username taken
      const isTakenInPremium = await PremiumUsernameService.exists(
        'username',
        username
      );

      if (isTakenInPremium) {
        throw new Error(`This username has already in premium usernames`);
      }

      // Is username taken 2
      const isTakenInRegular = await UserService.findByUsername(username);

      if (isTakenInRegular) {
        throw new Error(`This username has already in usual usernames`);
      }

      return true;
    }),
  check('premiumUsername.price')
    .exists()
    .withMessage('Price cannot be empty')
    .bail()

    .isFloat({ min: minPrice, max: maxPrice })
    .withMessage(`Price must be a number in diapason ${minPrice} - ${maxPrice}`)
    .bail(),
  check('premiumUsername.available')
    .exists()
    .withMessage('Available cannot be empty')
    .bail()

    .isBoolean()
    .withMessage(`Available must be a boolean`)
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    return next();
  },
];

module.exports = premiumUsernameValidator;
