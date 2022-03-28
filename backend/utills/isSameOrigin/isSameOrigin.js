const parseURL = require('./parseURL');

/**
 * Check if two URLs are same origin
 * @param {string} a - URL A
 * @param {string} b - URL B
 * @returns {boolean} True if URLs are same origin
 *
 * See
 * https://html.spec.whatwg.org/multipage/origin.html#same-origin
 * https://nodejs.org/dist/latest/docs/api/url.html
 */
const isSameOrigin = (a = '', b = '') => {
  const urlA = parseURL(a);
  const urlB = parseURL(b);

  if (!urlA || !urlB) {
    return false;
  }

  if (urlA.origin === urlB.origin) {
    return true;
  }

  if (
    urlA.protocol === urlB.protocol &&
    urlA.hostname === urlB.hostname &&
    urlA.port === urlB.port
  ) {
    return true;
  }

  return false;
};

module.exports = isSameOrigin;
