const { URL } = require('url');
const cheerio = require('cheerio');
const isUrl = require('is-url');

const getImageBase64ByUrl = require('../getImageBase64ByUrl');
const getImageBufferData = require('../../getImageBufferData');

const {
  POST_PREVIEW_IMAGE_WIDTH,
  POST_PREVIEW_IMAGE_HEIGHT,
} = require('../../../constants/post');

const templates = {
  invalidSrc: '<span>[incorrect image]</span>',
  loadingError: '<span>[image processing error]</span>',
};

/**
 * This function formattes post images
 *
 * @async
 * @param {string} html - Post html
 * @param {string} postTitle - Post title
 * @returns {<Promise>Array} - Formatted post html and post image string
 */
const postImagesFormatter = async (html = '', postTitle = '') => {
  // 1. Load html
  const $ = cheerio.load(html, null, false);

  // Promise solution from https://stackoverflow.com/a/23608348
  let p = Promise.resolve();

  let previewImage = null;

  // 2. Find images
  $('img').each((i, img) => {
    p = p.then(async () => {
      try {
        const { src } = img.attribs;

        if (!src || !isUrl(src)) {
          return $(img).replaceWith(templates.invalidSrc);
        }

        // Get image buffer
        const imageBuffer = await getImageBase64ByUrl(src);

        try {
          // Get image data
          const [width, height] = await getImageBufferData(imageBuffer);

          // Set width and height to image attributes
          $(img).attr('width', width);
          $(img).attr('height', height);

          // Set alt attribute
          $(img).attr('alt', `post image ${postTitle.toLowerCase()} ${i + 1}`);

          // Set as post preview
          if (!previewImage) {
            const url = new URL(src);

            url.searchParams.append(POST_PREVIEW_IMAGE_WIDTH, width);
            url.searchParams.append(POST_PREVIEW_IMAGE_HEIGHT, height);

            previewImage = url;
          }

          return true;
        } catch (_) {
          return $(img).replaceWith(templates.invalidSrc);
        }
      } catch (e) {
        console.log(e);
        return $(img).replaceWith(templates.loadingError);
      }
    });
  });

  return p.then(() => [$.html(), previewImage]).catch((e) => new Error(e));
};

module.exports = postImagesFormatter;
