import getSiteName from '../getSiteName';

const siteName = getSiteName();

/**
 * This function gets a title
 * If there is a long text title will look like: Some text...
 * If there is a short text title will look like: Some text | siteName
 *
 * @param {string} text - Text
 * @param {number} titleLength - Title length (optinal)
 * @returns {string} Title
 */
const getTitle = (text = '', titleLength = 70) => {
  const prefix = ` | ${siteName}`;

  const title =
    text.length < titleLength - prefix.length ? `${text}${prefix}` : text;

  return title;
};

export default getTitle;
