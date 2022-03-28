const XML = require('xml');

/**
 * This function generates XML
 *
 * @param {any} data - Data to XML
 * @returns {string} Sitemap XML
 */
const generateXML = (data) => {
  const result = XML(data);

  return result;
};

module.exports = generateXML;
