const { URL } = require('url');

/**
 * This function checks is url subdomain
 *
 * @param {string} link - Link url
 * @param {string} domain - Domain url
 * @returns {boolean} True if subdomain
 */
const isDomainSubdomain = (link = '', domain = '') => {
  const linkHostname = new URL(link).hostname;
  const domainHostname = new URL(domain).hostname;

  const match = linkHostname.indexOf(domainHostname) + 1;

  return Boolean(match);
};

module.exports = isDomainSubdomain;
