const sanitizeHTMLPackage = require('sanitize-html');

const getConfig = (type = '') => {
  const config = {
    ...sanitizeHTMLPackage.defaults,
    allowedTags: ['p', 'b', 'i', 'a', 'br'],
    allowedAttributes: {
      a: ['href', 'rel', 'target'], // these params are allowed because we configurate them in convertEditorJSToHTML
    },
    allowedSchemes: ['http', 'https'],
    allowedSchemesAppliedToAttributes: ['href', 'src'],
  };

  if (type === 'post') {
    config.allowedTags = [
      ...config.allowedTags,
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'iframe',
      'hr',
      'figure',
      'img',
    ];

    config.allowedAttributes.iframe = [
      'width',
      'height',
      'src',
      'frameborder',
      'allow',
      'allowfullscreen',
    ];

    config.allowedAttributes.img = ['width', 'height', 'src', 'title', 'alt'];

    config.allowedIframeDomains = ['youtube.com'];
  }

  return config;
};

/**
 * This function sanitizes EditorJS HTML
 *
 * @param {string} type - Type (post or comment)
 * @param {string} HTML - HTML
 * @returns {Array} Sanitized data
 */
const sanitizeHTML = (type = '', HTML = '') => {
  const config = getConfig(type);

  const cleanHTML = sanitizeHTMLPackage(HTML, config);

  return cleanHTML;
};

module.exports = sanitizeHTML;
