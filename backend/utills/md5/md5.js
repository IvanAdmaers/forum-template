const crypto = require('crypto');

/**
 * This function creates md5 hash
 *
 * @param {any} data - Data to hash
 * @returns {string} md5 hash
 */
const md5 = (data) => crypto.createHash('md5').update(data).digest('hex');

module.exports = md5;
