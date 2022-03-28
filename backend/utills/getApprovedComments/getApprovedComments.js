/**
 * This function gets approved comments
 *
 * @param {array} posts - Comments list
 * @returns {array} Approved comments
 */
const getApprovedComments = (comments = []) => {
  const commentsList = [...comments];

  const approvedComments = commentsList.filter(
    ({ moderation }) => moderation.approved !== false
  );

  return approvedComments;
};

module.exports = getApprovedComments;
