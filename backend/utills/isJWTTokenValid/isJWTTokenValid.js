const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY;

/**
 * Thsi function checks is JWT token valid
 *
 * @param {string} token - JWT Token
 * @returns {<Promise>boolean} True if token is correct
 */
const isJWTTokenValid = (token = '') => {
  try {
    return jwt.verify(token, secretKey, (err) => {
      if (err) return false;

      return true;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = isJWTTokenValid;
