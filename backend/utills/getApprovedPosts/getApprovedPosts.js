/**
 * This function gets approved posts
 *
 * @param {array} posts - Posts list
 * @returns {array} Approved posts
 */
const getApprovedPosts = (posts = []) => {
  const postsList = [...posts];

  const approvedPosts = postsList.filter((post) => {
    const moderation = post.post ? post.post.moderation : post.moderation;

    return moderation.approved !== false;
  });

  return approvedPosts;
};

module.exports = getApprovedPosts;
