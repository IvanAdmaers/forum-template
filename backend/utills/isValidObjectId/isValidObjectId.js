const { Types } = require('mongoose');

/**
 * Thsi function checks is object id valid
 *
 * @param {string} id - Object id
 * @returns {boolean} True if object id is correct
 */
const isValidObjectId = (id = '') => Types.ObjectId.isValid(id);

module.exports = isValidObjectId;
