/**
 * This function adds minutes to date
 *
 * @param {string} date - Date
 * @param {number} minutes - Number of minutes
 * @returns {string} Date + minutes
 */
const addMinutesToDate = (date, minutes = 0) =>
  new Date(date.getTime() + minutes * 60000);

module.exports = addMinutesToDate;
