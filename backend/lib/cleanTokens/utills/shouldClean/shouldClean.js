const { DateDifference } = require('../../../../utills');

/**
 * This function calcs should clean
 *
 * @param {date} date1 - Date
 * @param {number} diffInDays - Difference in days
 */
const shouldClean = (date1, diffInDays) => {
  const diff = DateDifference.inDays(date1, new Date());

  const should = diff > diffInDays;

  return should;
};

module.exports = shouldClean;
