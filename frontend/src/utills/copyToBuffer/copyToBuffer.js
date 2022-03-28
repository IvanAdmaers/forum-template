/**
 * This function copies text to buffer
 *
 * @function copyToBuffer
 * @async
 * @param {string} Text - text to copy
 * @returns {boolean} True if all good
 */
const copyToBuffer = async (text = '') => {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export default copyToBuffer;
