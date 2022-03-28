const AbortController = require('abort-controller');
const fetch = require('node-fetch');

/**
 * This function gets image buffer by url
 *
 * @param {string} url - Image url
 * @returns {<Promise>Buffer | null} Image buffer or null
 */
const getBufferByUrl = async (url = '') => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const req = await fetch(url, { signal });

    clearTimeout(timeout);

    const res = await req.buffer();

    return res;
  } catch (e) {
    return null;
  }
};

module.exports = getBufferByUrl;
