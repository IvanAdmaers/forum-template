const Risk = require('../models/RiskModel');

const getDatesDifferenceInMinutes = (date1, date2) =>
  (date1 - date2) / 1000 / 60;

class RickService {
  constructor() {
    this._types = ['authentication', 'registration', 'reset-password'];
  }

  _defineFieldName(type = '') {
    switch (type) {
      case 'authentication':
        return 'authAttempts';

      case 'registration':
        return 'registerAttempts';

      case 'reset-password':
        return 'resetPasswordAttempts';

      default:
        throw new Error('Type is not known');
    }
  }

  /**
   * This method adds new document in risk collection
   *
   * @async
   * @param {string} ip - Request ip
   * @param {string} type - Attempt type
   * @param {string} userAgent - Request user-agent
   * @returns {Promise<boolean>} True if everything good
   */
  async add(ip = '', type = '', userAgent = '') {
    if (!this._types.includes(type)) throw new Error('Type is not known');

    const document = await Risk.findOne({ ip });

    const risk = {
      userAgent,
    };

    // const fieldName =
    //   type === 'authentication' ? 'authAttempts' : 'registerAttempts';
    const fieldName = this._defineFieldName(type);

    // Create new document
    if (!document) {
      const newDocument = new Risk({
        ip,
        [fieldName]: [risk],
      });

      await newDocument.save();

      return true;
    }

    document[fieldName].push(risk);

    await document.save();

    return true;
  }

  /**
   * This method evaluates authentication action risk
   *
   * @async
   * @param {string} ip - Request ip
   * @returns {Promise<boolean>} True is there is no risk
   */
  async _shouldLetAuthAction(ip = '') {
    /**
     * How does this work?
     *
     * The request is blocked if:
     * there have been > 3 actions done in the last 30 minutes and between the last
     * and the current time has passed less than 1 minute
     */
    const document = await Risk.findOne({ ip }).lean();

    // Case 1 - User is clear
    if (!document) {
      return true;
    }

    const { authAttempts } = document;

    // Get auth attempts for last 30 minutes
    const authAttemptsFiltered = authAttempts.filter(({ date }) => {
      const timeDifference = getDatesDifferenceInMinutes(new Date(), date);

      if (timeDifference < 30) {
        return true;
      }

      return false;
    });

    // Check amount of attempts
    const authAttemptsLength = authAttemptsFiltered.length;

    if (authAttemptsLength < 3) {
      return true;
    }

    // Get time difference
    const lastAction = [...authAttemptsFiltered].pop();

    const timeDifference = getDatesDifferenceInMinutes(
      new Date(),
      lastAction.date
    );

    if (timeDifference < 1) {
      return false;
    }

    return true;
  }

  /**
   * This method evaluates authentication action risk
   *
   * @async
   * @param {string} ip - Request ip
   * @returns {Promise<boolean>} True is there is no risk
   */
  async _shouldLetRegisterAction(ip = '') {
    /**
     * How does this work?
     *
     * If less than 10 minutes have passed since the last registration, block
     */

    const document = await Risk.findOne({ ip }).lean();

    if (!document) {
      return true;
    }

    const { registerAttempts } = document;

    if (!registerAttempts.length) {
      return true;
    }

    const lastAction = [...registerAttempts].pop();

    const timeDifference = getDatesDifferenceInMinutes(
      new Date(),
      lastAction.date
    );

    if (timeDifference < 10) {
      return false;
    }

    return true;
  }

  /**
   * This method evaluates reset password action risk
   *
   * @async
   * @param {string} ip - Request ip
   * @returns {Promise<boolean>} True is there is no risk
   */
  async _shouldLetResetPasswordAction(ip = '') {
    /**
     * How does this work?
     *
     * The request is blocked if:
     * less than 5 minutes elapsed between the last action and the current one
     */
    const document = await Risk.findOne({ ip }).lean();

    // User is clear
    if (!document) {
      return true;
    }

    const { resetPasswordAttempts } = document;

    // There is no reset password attempts
    if (!resetPasswordAttempts.length) {
      return true;
    }

    const lastAction = [...resetPasswordAttempts].pop();

    const timeDifference = getDatesDifferenceInMinutes(
      new Date(),
      lastAction.date
    );

    if (timeDifference < 5) {
      return false;
    }

    return true;
  }

  _defineShouldLetMethod(type = '') {
    switch (type) {
      case 'authentication':
        return this._shouldLetAuthAction;

      case 'registration':
        return this._shouldLetRegisterAction;

      case 'reset-password':
        return this._shouldLetResetPasswordAction;

      default:
        throw new Error('Type is not known');
    }
  }

  /**
   * This methods evaluates action risk
   *
   * @param {string} ip - Request ip
   * @param {string} type - Action type
   * @returns {Promise<boolean>} True is there is no risk
   */
  async shouldLetAction(ip = '', type = '') {
    if (!this._types.includes(type)) throw new Error('Type is not known');

    const shouldLetMethod = this._defineShouldLetMethod(type);
    const shouldLet = await shouldLetMethod(ip);

    return shouldLet;
  }
}

module.exports = new RickService();
