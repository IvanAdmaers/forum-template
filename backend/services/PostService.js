const getSlug = require('slug');

const Post = require('../models/PostModel');
// Circular dependency issue
// Warning: Accessing non-existent property 'getGroupAuthor' of module exports inside circular dependency
// const GroupService = require('./GroupService');

const { uuid, toObjectId, isValidObjectId } = require('../utills');

// const {
//   sanitizePost,
//   postLinksFormatter,
//   postImagesFormatter,
// } = require('../utills/postsUtills');

class PostService {
  /**
   * This method prepares post HTML to save
   *
   * @async
   * @param {string} html - Post html
   * @param {string} title - Post title
   * @returns {<Promise>Array} Post HTML and preview image
   */
  // async prepareHTML(html = '', title = '') {
  //   const { clientUrl } = process.env;

  //   // 1. Sanitize HTML
  //   const sanitizedHTML = sanitizePost(html);

  //   // 2. Format links
  //   const formattedLinksHTML = await postLinksFormatter(
  //     sanitizedHTML,
  //     clientUrl
  //   );

  //   // 3. Format images
  //   const [finallyHTML, previewImage] = await postImagesFormatter(
  //     formattedLinksHTML,
  //     title
  //   );

  //   return [finallyHTML, previewImage];
  // }

  /**
   * This function finds post by slug
   *
   * @async
   * @param {string} slug - Post slug
   * @returns {<Promise>object} - Post object or null
   */
  async getBySlug(slug = '', fields = '') {
    const post = await Post.findOne({ slug }).select(fields).lean();

    return post;
  }

  /**
   * This method creates new post
   *
   * @async
   * @param {object} options - Object of options
   * @returns {<Promise>object} Object with fields slug and id
   */
  async create(options) {
    const {
      authorId,
      title,
      body,
      previewImage,
      groupId,
      isNSFW,
      sendReplies,
      isOriginalContent,
      __slug,
    } = options;

    const self = this;

    const slug = __slug || getSlug(title);

    // Check slug exists
    const isSlugExists = await this.getBySlug(slug);

    if (isSlugExists) {
      const symbols = uuid().substring(0, 4);

      const newSlug = `${slug}-${symbols}`;

      return self.create({ ...options, __slug: newSlug });
    }

    const authorObjectId = toObjectId(authorId);

    const { blocks, HTML } = body;

    // Create new post
    const newPost = new Post({
      author: authorObjectId,
      title,
      slug,
      body: { blocks, HTML },
      isNSFW,
      sendReplies,
      isOriginalContent,
    });

    if (previewImage) {
      newPost.previewImage = previewImage;
    }

    const [refField, refValue] = this._getPostRefer(groupId, authorId);

    newPost[refField] = refValue;

    const { _id: newPostId, slug: newPostSlug } = await newPost.save();

    return { id: newPostId, slug: newPostSlug };
  }

  /**
   * This method defines refer field
   *
   * @param {string} groupId - Group id
   * @param {string} authorId - Author id
   * @returns {Array} Firs item is field. Second item is value
   */
  _getPostRefer(groupId = '', authorId = '') {
    if (groupId === '1') {
      return ['user', toObjectId(authorId)];
    }

    return ['group', toObjectId(groupId)];
  }

  /**
   * This method gets post info
   *
   * @async
   * @param {string} slug - Post slug
   * @param {string} postFields - Post document fields
   * @returns {<Promise>object} Post data object or null
   */
  async get(slug = '', postFields = '', authorFields, ratingFields) {
    const post = await Post.findOne({ slug })
      .select(postFields)
      .lean()
      .populate('author', authorFields)
      .lean()
      .populate('group')
      .lean()
      .populate('user')
      .lean()
      .populate('rating', ratingFields)
      .lean()
      .populate('comments')
      .lean();

    if (!post) {
      return null;
    }

    // Is post pinned
    post.pinned = post.group?.pinnedPosts?.find(
      (pinnedPost) => pinnedPost.post.toString() === post._id.toString()
    );

    // Post comments count
    post.commentsCount = post.comments.length;

    return post;
  }

  /**
   * This method gets post info by post id
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} postFields - Post document fields
   * @returns {<Promise>object} Post data object or null
   */
  async findById(postId = '', postFields = '', authorFields, ratingFields) {
    if (!isValidObjectId(postId)) {
      return null;
    }

    const post = await Post.findById(postId)
      .select(postFields)
      .lean()
      .populate('author', authorFields)
      .lean()
      .populate('group')
      .lean()
      .populate('user')
      .lean()
      .populate('rating', ratingFields)
      .lean()
      .populate('comments')
      .lean();

    if (!post) {
      return null;
    }

    // Post comments count
    post.commentsCount = post.comments.length;

    return post;
  }

  /**
   * This method gets user rights for post
   *
   * @async
   * @param {object} post - Post data (authorId, userId, groupId)
   * @param {string} userId - User id
   * @param {string} userRoles - User roles
   * @returns {<Promise>object} User roles for post
   */
  async userRoles(post = {}, userId = '', userRoles = []) {
    // eslint-disable-next-line global-require
    const GroupService = require('./GroupService');

    const user = {
      isAuthor: false,
      isModerator: false,
      isGroupAuthor: false,
    };

    if (!userId) {
      return user;
    }

    // Check if user post owner
    if (userId === post.authorId.toString()) {
      user.isAuthor = true;
    }

    // Check if user moderator
    if (userRoles.includes('moderator')) {
      user.isModerator = true;
    }

    // Check if it's post to user profile
    if (post.userId) {
      return user;
    }

    // Check if user the author of the group
    const groupAuthorId = await GroupService.getGroupAuthor(post.groupId);

    if (userId === groupAuthorId) {
      user.isGroupAuthor = true;
    }
    return user;
  }

  /**
   * This method connects other document with post document
   *
   * @async
   * @param {string} documentId - Post document id
   * @param {string} field - Field
   * @param {string} id - Connected document id
   * @returns {<Promise>boolean} True if everying ok
   */
  async connectWithDocument(documentId = '', field = '', id = '') {
    await Post.findByIdAndUpdate(documentId, {
      $set: { [field]: toObjectId(id) },
    });

    return true;
  }

  /**
   * This method checks is user post author
   *
   * @async
   * @param {string} userId - User id
   * @param {string} postSlug - Post slug
   * @returns {<Promise>boolean} True if user is an author
   */
  async isAuthor(userId = '', postSlug = '') {
    const post = await Post.findOne({ slug: postSlug }).select('author').lean();

    if (!post) return false;

    const isAuthor = post.author.toString() === userId;

    return isAuthor;
  }

  /**
   * This method updates post
   *
   * @async
   * @param {string} slug - Post slug
   * @param {object} options - Post options
   * @returns {<Promise>boolean} True if post was updated
   */
  async update(slug = '', options) {
    const { title, body, previewImage, isNSFW, isOriginalContent } = options;
    const { blocks, HTML } = body;

    const editedAt = Date.now();

    await Post.findOneAndUpdate(
      { slug },
      {
        title,
        body: { blocks, HTML },
        isNSFW,
        previewImage,
        isOriginalContent,
        editedAt,
      }
    );

    return true;
  }

  /**
   * This method returns count of all posts
   *
   * @async
   * @returns {<Promise>number} Number of all posts
   */
  async totalCount() {
    const count = await Post.countDocuments();

    return count;
  }

  /**
   * This method gets posts
   *
   * @async
   * @param {number} limit - Limit
   * @param {number} startIndex - Start index
   * @returns {<Promise>Array} Array of posts
   */
  async getPosts(limit = 10, startIndex = 0) {
    const postsList = await Post.find({ group: { $exists: true, $ne: null } })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .select('slug')
      .lean()
      .lean();

    const postsPromises = [];

    postsList.forEach(({ slug }) => {
      postsPromises.push(this.get(slug));
    });

    const posts = await Promise.all(postsPromises);

    return posts;
  }

  /**
   * This method gets post comments
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} authorFields - Author fields (optional)
   * @param {string} ratingFields - Rating fields (optional)
   * @returns {<Promose>array} Post comments
   */
  async getComments(postId = '') {
    const commentsDocument = await Post.findById(postId)
      .select('comments')
      .lean()
      .populate({
        path: 'comments',
        populate: {
          path: 'author rating moderation',
          populate: {
            path: 'verified',
          },
        },
      })
      .lean();

    const { comments } = commentsDocument;

    if (!comments.length) {
      return [];
    }

    // Get comments list
    comments.forEach((comment) => {
      const currentComment = comment;
      const commentId = currentComment._id.toString();

      const children = this._getChildrenComments(comments, commentId);

      currentComment.children = children;

      return true;
    });

    const commentsList = comments.filter(({ parent }) => !parent);

    return commentsList;
  }

  /**
   * This method gets children comments
   *
   * @param {array} comments - Comments
   * @param {string} parentId - Parent id
   * @returns {array|null} Array of posts or null if there is not children
   */
  _getChildrenComments(comments = [], parentId = '') {
    const children = comments.filter(
      ({ parent }) => parent?.toString() === parentId
    );

    return children.length ? children : null;
  }

  /**
   * This method adds new comment to post
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} commentId - Comment id
   * @returns {<Promise>boolean} True if everything ok
   */
  async addNewComment(postId = '', commentId = '') {
    const commentObjectId = toObjectId(commentId);

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: commentObjectId },
    }).lean();

    return true;
  }

  /**
   * This method checks comment exists
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} commentId - Comment id
   * @returns {<Promise>boolean} True if comment exists
   */
  async isCommentExists(postId = '', commentId = '') {
    if (!isValidObjectId(commentId)) {
      return false;
    }

    const postDocument = await Post.findByIdAndUpdate(postId)
      .select('comments')
      .lean();

    const { comments } = postDocument;

    const comment = comments.find(
      (commentObjectId) => commentObjectId.toString() === commentId
    );

    return Boolean(comment);
  }

  /**
   * This method gets total count of documents by search query
   *
   * @async
   * @param {string} q - Search query
   * @returns {<Promise>number} - Number of documents
   */
  async searchTotalCount(q = '') {
    const searchQuery = new RegExp(q, 'i');

    const count = await Post.countDocuments({
      $or: [{ title: searchQuery }, { slug: searchQuery }],
    });

    return count;
  }

  /**
   * This method finds groups by search query
   *
   * @async
   * @param {string} q - Search query
   * @param {number} limit - Limit
   * @param {number} skip - Skip
   * @returns {<Promise>Array} - Groups array
   */
  async search(q = '', limit = 20, skip = 0) {
    const searchQuery = new RegExp(q, 'i');

    const posts = await Post.find({
      $or: [{ title: searchQuery }, { slug: searchQuery }],
    })
      .limit(limit)
      .skip(skip)
      .lean();

    return posts;
  }

  /**
   * This method deletes a post
   *
   * @async
   * @param {string} id - Post id
   * @returns {<Promise>boolean} True if everything is ok
   */
  async delete(id = '') {
    const objectId = toObjectId(id);
    const status = await Post.findByIdAndDelete(objectId);

    return status;
  }
}

module.exports = new PostService();
