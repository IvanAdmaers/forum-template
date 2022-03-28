const { Types } = require('mongoose');

/**
 * This function converts value to mongoose object id
 *
 * @param {string} value - Value to convert
 * @returns {Object} Mongoose object id
 */
const toObjectId = (value = '') => Types.ObjectId(value);

module.exports = toObjectId;
