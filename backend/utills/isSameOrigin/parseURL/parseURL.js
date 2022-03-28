const { URL } = require('url');

const parseURL = (stringURL = '') => {
  try {
    return new URL(stringURL);
  } catch (_) {
    return null;
  }
};

module.exports = parseURL;
