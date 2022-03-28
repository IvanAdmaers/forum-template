const { URL } = require('url');

/**
 * This function compares urls
 *
 * @param {string} link - First url
 * @param {string} domain - Seconds url
 * @returns {boolean} True if urls are the same
 */
const isTheSameDomain = (link = '', domain = '') => {
  const linkHostname = new URL(link).hostname;
  const domainHostname = new URL(domain).hostname;

  return linkHostname === domainHostname;
};

module.exports = isTheSameDomain;
