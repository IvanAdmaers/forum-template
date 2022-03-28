const sanitizeHtml = require('sanitize-html');

/**
 * This function cleans string from any HTML tags or attributes
 *
 * @param {string} html - String to clean
 * @returns {string} Cleaned string
 */
const cleanHtml = (html = '') =>
  sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} });

module.exports = cleanHtml;
