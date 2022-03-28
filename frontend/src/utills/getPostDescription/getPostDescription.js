/**
 * This function gets post description
 *
 * @param {string} title - Post title
 * @param {number} comments - Number of post comments
 * @param {number} rating - Post rating
 * @param {string | null} groupTitle - Group title
 * @returns {string} Post description
 */
const getPostDescription = (
  title = '',
  comments = 0,
  rating = 0,
  groupTitle
) => {
  let description = `Post ${title}. Post rating ${rating}. Number of comments ${comments}`;

  if (groupTitle) {
    description += ` Group ${groupTitle}`;
  }

  return description;
};

export default getPostDescription;
