import getRandomId from 'utills/getRandomId';

/**
 * This function creates an array of required length
 *
 * @param {number} length - Array length. 10 by default
 * @returns {Array} Array
 */
const createFakeArray = (length = 10) =>
  new Array(length).fill('_').map(() => getRandomId());

export default createFakeArray;
