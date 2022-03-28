const cheerio = require('cheerio');

const isUrl = require('is-url');
const isTheSameDomain = require('../isTheSameDomain');
const isDomainSubdomain = require('../isDomainSubdomain');

const templates = {
  incorrectUrl: '<span>[incorrect link]</span>',
};

/**
 * This function does: set rel, target attributes. Check link url in spam bases
 *
 * @async
 * @param {string} html - Post html
 * @param {string} domain - Domain
 * @returns {<Promise>string} Formatted html
 */
const postLinksFormatter = async (
  html = '',
  domain = process.env.CLIENT_URL
) => {
  const $ = cheerio.load(html, null, false);

  $('a').each((i, item) => {
    // Get link href
    const { href } = item.attribs;

    // 1. Check href exists and check is url valid
    const isValidLink = isUrl(href);

    if (!href || !isValidLink) {
      return $(item).replaceWith(templates.incorrectUrl);
    }

    // 2. Check url in spam bases
    // Need to do

    // 3. Set link attributes
    /* 
      If it's our forum url, don't set target blank and rel noindex nofollow
      If it's out forum subdomain, set target blank, but dont's set rel noindex nofollow
    */
    const isForumUrl = isTheSameDomain(href, domain);
    const isForumSubdomainUrl = isDomainSubdomain(href, domain);

    if (!isForumUrl) {
      $(item).attr('target', '_blank');

      if (!isForumSubdomainUrl) {
        $(item).attr('rel', 'noindex nofollow');
      }
    }

    // think about it
    $(item).attr(
      'class',
      'MuiTypography-root MuiLink-root MuiLink-underlineAlways MuiTypography-colorInherit'
    );

    return true;
  });

  return $.html();
};

// const htmlToTes = `
// <p>Hello, world! Check the link - <a href="https://google.com">google</a>!.
// And another one - <a href="https://bing.com">bing</a>.
// And our link - And another one - <a href="http://localhost:3000">our forum</a>.
// And finally it's our subdomain - <a href="http://sub.localhost:3000">our forum subdomain</a>.
// And link without href - <a>there is no href</a>.
// </p>
// `;

module.exports = postLinksFormatter;
