const sharp = require('sharp');

/**
 * This function gets image data by buffer
 *
 * @async
 * @param {string} buffer - Image buffer
 * @returns {<Promise>Array} - Array of items. First is width, second is height [width, height]
 */
const getImageBufferData = async (buffer = '') => {
  const data = await sharp(buffer).toBuffer({ resolveWithObject: true });

  const { width, height } = data.info;

  return [width, height];
};

module.exports = getImageBufferData;
