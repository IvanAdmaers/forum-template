const { check, validationResult } = require('express-validator');

const PremiumUsernameService = require('../../services/PremiumUsernameService');

const { isValidObjectId } = require('../../utills');

const minPrice = 0.1;
const maxPrice = 99999;

const editPremiumUsernameValidator = [
  check('premiumUsername.id')
    .exists()
    .withMessage('Id cannot be empty')
    .bail()

    .isString()
    .withMessage('Id must be a string')
    .bail()

    .custom(async (id) => {
      const isValid = isValidObjectId(id);

      if (!isValid) {
        throw new Error('Id is not correct');
      }

      const exists = await PremiumUsernameService.exists('id', id);

      if (!exists) {
        throw new Error('Premium username was not found');
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
  check('premiumUsername.discountPrice')
    .optional()

    .exists()
    .withMessage('Discount price cannot be empty')
    .bail()

    .isFloat({ min: minPrice, max: maxPrice })
    .withMessage(
      `Discount price must be a number in diapason ${minPrice} - ${maxPrice}`
    )
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

module.exports = editPremiumUsernameValidator;
