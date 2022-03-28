const FileType = require('file-type');

/**
 * This function gets file data by buffer
 *
 * @async
 * @param {Buffer} buffer - buffer
 * @returns {<Promise>object} Object with data
 */
const getFileDataByBuffer = async (buffer = '') => {
  try {
    const data = await FileType.fromBuffer(buffer);

    return data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = getFileDataByBuffer;
