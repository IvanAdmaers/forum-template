const cheerio = require('cheerio');

const isSameOrigin = require('../../isSameOrigin');

/**
 * This function handles Editor JS block and modified links
 *
 * @param {string} text - Text to handle
 * @returns {string} Handled text
 */
const handleLinks = (text = '') => {
  const $ = cheerio.load(text, null, false);

  const clientUrl = process.env.CLIENT_URL;

  $('a').each((i, item) => {
    const { href } = item.attribs;

    const isClientURL = isSameOrigin(href, clientUrl);

    $(item).attr('target', '_blank');

    if (isClientURL) return;

    $(item).attr('rel', 'noopener nofollow ugc');
  });

  return $.html();
};

module.exports = handleLinks;
