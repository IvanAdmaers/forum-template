const handleLinks = require('./handleLinks');

const getHTML = (block = {}, postTitle = '') => {
  const { level, text, width, height, embed, caption } = block.data;
  const {
    url: imageUrl,
    width: imageWidth,
    height: imageHeight,
  } = block.data.file || {};

  switch (block.type) {
    case 'header':
      return `<h${level}>${text}</h${level}>`;
    case 'embed':
      return `<iframe width="${width}" height="${height}" src="${embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    case 'paragraph': {
      const handledText = handleLinks(text);

      return `<p>${handledText}</p>`;
    }
    case 'delimiter':
      return '<hr />';
    case 'image': {
      const alt = !caption ? `${postTitle} image` : caption;
      const titleAttribute = caption ? `title="${caption}"` : '';
      const figcaptionElement = caption
        ? `<figcaption>${caption}</figcaption>`
        : '';

      return `<figure><img width="${imageWidth}" height="${imageHeight}" src="${imageUrl}" ${titleAttribute} alt="${alt}" />${figcaptionElement}</figure>`;
    }
    default:
      console.log('Unknown block type', block.type);
      return '';
  }
};

/**
 * This function convets Editor JS blocks to HTML
 *
 * @param {array} blocks - Editor JS blocks
 * @param {string} postTitle - Post title
 * @returns {string} Converted HTML
 */
const convertEditorJSToHTML = (blocks = [], postTitle = '') => {
  let convertedHTML = '';

  blocks.forEach((block) => {
    convertedHTML += getHTML(block, postTitle);
  });

  return convertedHTML;
};

module.exports = convertEditorJSToHTML;
