const md5 = require('../md5');

/**
 * This function gets Gravatar url
 *
 * @param {string} email - Email in lower case and trimmed
 * @returns {string} Gravarar image url
 */
const getGravatar = (email = '') => {
  const emailHash = md5(email);

  const avatar = `https://www.gravatar.com/avatar/${emailHash}`;

  return avatar;
};

module.exports = getGravatar;
