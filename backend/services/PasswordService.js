const bcrypt = require('bcrypt');

class PasswordService {
  constructor() {
    this._saltRounds = 10;
  }

  /**
   * This method hashes password
   *
   * @async
   * @param {string} password - Password
   * @returns {Promise<string>} Hashed password string
   */
  async hash(password = '') {
    try {
      const hashedPassword = await bcrypt.hash(password, this._saltRounds);

      return hashedPassword;
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * This method compares passwords
   *
   * @async
   * @param {string} password - The password to be compared against
   * @param {string} userPassword - The encrypted user password
   * @returns {Promise<boolean>} True is the passwords are the same
   */
  async compare(password = '', userPassword = '') {
    try {
      const areTheSame = await bcrypt.compare(password, userPassword);

      return areTheSame;
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new PasswordService();
