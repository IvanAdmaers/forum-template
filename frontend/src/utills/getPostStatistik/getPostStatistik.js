/**
 * This function returns modified value of rating
 *
 * @function getPostStatistik
 * @param {number} count - Count of elements
 * @returns {string} Modified value
 */

const getPostStatistik = (count = 0) => {
  if (count === 0) return '0';

  if (count < 1000) return `${count}`;

  const value = count / 1000;

  return `${value.toFixed(1)}k`;
};

export default getPostStatistik;
