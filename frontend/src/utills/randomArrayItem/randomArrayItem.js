/**
 * This function returns random array element
 *
 * @function randomArrayItem
 * @param {array} array
 */
const randomArrayItem = (array = []) => {
  const arr = [...array];

  const index = Math.floor(Math.random() * arr.length);

  return arr[index];
};

export default randomArrayItem;
