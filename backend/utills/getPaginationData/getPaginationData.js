/**
 * This function convers value to number
 *
 * @param {any} value - Value to convert
 * @param {number} defaultValue - Default value
 * @param {number} maxLimit - Max limit
 * @returns {number} Coverted value
 */
const toNumber = (value, defaultValue = 1, maxLimit) => {
  const num = parseInt(value, 10);

  if (typeof num !== 'number') return defaultValue;

  if (maxLimit && num > maxLimit) return defaultValue;

  return num;
};

/**
 * This function gets data for pagination
 *
 * @param {any} page - Page
 * @param {any} limit - Limit
 * @param {number} total - Total documents
 * @returns {object} Object with pagination params
 */
const getPaginationData = (page = 1, limit = 10, total = 0) => {
  const currentPage = toNumber(page, 1);
  const currentLimit = toNumber(limit, 10, 100);

  const startIndex = (currentPage - 1) * currentLimit;
  const numberOfPages = Math.ceil(total / currentLimit);

  return {
    page: currentPage,
    limit: currentLimit,
    startIndex,
    numberOfPages,
  };
};

module.exports = getPaginationData;
