const fetch = require('node-fetch');

/**
 * This function gets image buffer
 *
 * @async
 * @param {string} url - Image url
 * @returns {<Promise>string} - Image buffer
 */
const getImageBase64ByUrl = async (url = '') => {
  try {
    const req = await fetch(url);

    const res = await req.buffer();

    return res;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = getImageBase64ByUrl;
