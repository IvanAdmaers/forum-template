const sanitizeHtml = require('sanitize-html');

const options = {
  allowedTags: ['h2', 'strong', 'u', 'a', 'p', 'br', 'img', 'figure'],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'class'],
    img: ['src', 'alt', 'width', 'height'],
  },
};

const sanitizePost = (html = '') => sanitizeHtml(html, options);

module.exports = sanitizePost;
