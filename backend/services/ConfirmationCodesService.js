const ConfirmationCode = require('../models/ConfirmationCodesModel');
const UserService = require('./UserService');

const { toObjectId } = require('../utills');

class ConfirmationCodesService {
  constructor() {
    this._types = ['email', 'reset-password'];
  }

  _defineField(type = '') {
    switch (type) {
      case 'email':
        return 'emailConfirmations';

      case 'reset-password':
        return 'resetPasswordConfirmations';

      default:
        throw new Error('Type is not known');
    }
  }

  /**
   * This private method adds confirmation code in DB
   *
   * @async
   * @param {string} type - Type
   * @param {string} userId - User id
   * @param {string} code - Code
   * @returns {Promise<boolean>} True if everything good
   */
  async _addConfirmationCode(type = '', userId = '', code = '') {
    if (!this._types.includes(type)) throw new Error('Type is not known');

    const document = await ConfirmationCode.findOne({
      user: toObjectId(userId),
    });

    const date = new Date();

    const confirmationObject = {
      code,
      type,
      isConfirmed: false,
      date,
      lastMailRequest: date,
    };

    const field = this._defineField(type);

    // New document
    if (!document) {
      const newConfirmationCode = new ConfirmationCode({
        user: toObjectId(userId),
        [field]: [confirmationObject],
      });

      const { _id } = await newConfirmationCode.save();

      await UserService.connectWithDocument(userId, _id, 'confirmationCodes');

      return true;
    }

    // Document already exists

    document[field].push(confirmationObject);

    await document.save();

    return true;
  }

  /**
   * This method adds email confirmation code in DB
   *
   * @async
   * @param {stirng} userId - User id
   * @param {stirng} code - Confirmation code
   * @returns {Promise<boolean>} True if everything ok
   */
  async addEmailConfirmationCode(userId = '', code = '') {
    await this._addConfirmationCode('email', userId, code);

    return true;
  }

  /**
   * This method adds password confirmation code in DB
   *
   * @async
   * @param {stirng} userId - User id
   * @param {stirng} code - Confirmation code
   * @returns {Promise<boolean>} True if everything ok
   */
  async addResetPasswordConfirmationCode(userId = '', code = '') {
    await this._addConfirmationCode('reset-password', userId, code);

    return true;
  }

  /**
   * This method finds confimation code in DB and make confirmation
   *
   * @async
   * @param {string} userId - User id
   * @param {string} code - Confirmation code
   * @param {string} type - Type
   * @returns {Promise<object>} Object with error field
   */
  async makeConfirmation(userId = '', code = '', type = '') {
    const document = await ConfirmationCode.findOne({
      user: toObjectId(userId),
    });

    if (!document) {
      return { error: 'Record not found' };
    }

    const field = this._defineField(type);

    const confirmations = document[field];

    if (!confirmations || !confirmations.length) {
      return { error: 'Record not found' };
    }

    const lastConfirmationIndex = confirmations.length - 1;
    const lastConfirmation = confirmations[lastConfirmationIndex];

    if (lastConfirmation.code !== code || lastConfirmation.isConfirmed) {
      return { error: 'The code is incorrect' };
    }

    // Make confirmation
    document[field][lastConfirmationIndex].isConfirmed = true;

    await document.save();

    return { error: null };
  }

  /**
   * This method gets last email confirmation request date
   *
   * @param {string} userId - User id
   * @returns {<Promise>object} Error field or data field with date
   */
  async getLastEmailConfirmationRequestDate(userId = '') {
    const document = await ConfirmationCode.findOne({
      user: toObjectId(userId),
    })
      .select('emailConfirmations')
      .lean();

    const confirmations = document.emailConfirmations;

    const lastConfirmationIndex = confirmations.length - 1;

    const lastConfirmation = confirmations[lastConfirmationIndex];

    if (lastConfirmation.isConfirmed) {
      return { error: 'Mail has already been confirmed' };
    }

    return { date: lastConfirmation.lastMailRequest };
  }
}

module.exports = new ConfirmationCodesService();
