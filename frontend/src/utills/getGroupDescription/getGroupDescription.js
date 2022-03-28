/**
 * This function gets group description
 *
 * @param {string} title
 * @param {string | null} description
 * @param {number} membersCount
 * @returns {string} Group description
 */
const getGroupDescription = (
  title = '',
  description = '',
  membersCount = 0
) => {
  let groupDescription = `Group ${title}. Members count ${membersCount}`;

  if (description) {
    groupDescription += ` Description: ${description}`;
  }

  return groupDescription;
};

export default getGroupDescription;
