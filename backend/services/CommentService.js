const Comment = require('../models/CommentModel');

const RatingService = require('./RatingService');

const { toObjectId, isValidObjectId } = require('../utills');

class CommentService {
  /**
   * This method creates new comments document for post
   *
   * @async
   * @param {string} postId - Post id
   * @returns {<Promise>string} Created document id
   */
  // async create(postId = '') {
  //   const newCommentDocument = new Comment({
  //     post: toObjectId(postId),
  //   });

  //   const { _id } = await newCommentDocument.save();

  //   return _id.toString();
  // }

  /**
   * This method adds comment
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} userId - User id
   * @param {string|null} parentId - Parent comment id
   * @param {string} blocks - EditorJS blocks
   * @param {string} HTML - Comment HTML
   * @returns {<Promise>string} New comment id
   */
  async add(postId = '', userId = '', parentId, blocks = [], HTML = '') {
    const newComment = new Comment({
      post: toObjectId(postId),
      author: toObjectId(userId),
      body: {
        blocks,
        HTML,
      },
    });

    if (parentId) {
      newComment.parent = toObjectId(parentId);
    }

    const createdComment = await newComment.save();

    const newCommentId = createdComment._id.toString();

    // Create rating
    const ratingOptions = {
      commentId: newCommentId,
      authorId: userId,
    };

    const ratingId = await RatingService.create(ratingOptions);

    // Connect comment with rating
    newComment.rating = toObjectId(ratingId);

    await newComment.save();

    return newCommentId;
  }

  /**
   * This method gets comment data
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} commentId - Comment id
   * @param {string} authorFields - Author fields (optional)
   * @param {string} ratingFields - Rating fields (optional)
   * @returns {<Promise>object} Comment data
   */
  async get(commentId = '', authorFields, ratingFields) {
    const commentDocument = await Comment.findById(commentId)
      .populate('author', authorFields)
      .lean()
      .populate('rating', ratingFields)
      .lean()
      .populate('rating')
      .lean();

    return commentDocument;
  }

  /**
   * This method checks is parent id exists
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} parentId - Parent comment id
   * @returns {<Promise>boolean} True if parent id is exists
   */
  // refactor
  async isParentIdExists(postId = '', parentId = '') {
    if (!isValidObjectId(parentId)) {
      return false;
    }

    const parentObjectId = toObjectId(parentId);

    const parent = await Comment.findOne(
      { post: toObjectId(postId) },
      { comments: { $elemMatch: { _id: parentObjectId } } }
    );

    return !!parent;
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
  // async getComments(
  //   postId = '',
  //   authorFields = authorDtoFields,
  //   ratingFields = ratingDtoFields
  // ) {
  //   const commentsDocument = await Comment.findOne({ post: toObjectId(postId) })
  //     .select('comments')
  //     .lean()
  //     .populate('comments.author')
  //     .select(authorFields)
  //     .lean()
  //     .populate('comments.rating')
  //     .select(ratingFields)
  //     .populate('comments.moderation')
  //     .lean();

  //   const { comments } = commentsDocument;

  //   // Get approved comments
  //   const approvedComments = getApprovedComments(comments);

  //   approvedComments.forEach((comment) => {
  //     const currentComment = comment;
  //     const commentId = currentComment._id.toString();

  //     const children = this._getChildrenComments(comments, commentId);

  //     currentComment.children = children;
  //   });

  //   const commentsList = comments.filter(({ parent }) => !parent);

  //   return commentsList;
  // }

  /**
   * This method gets children comments
   *
   * @param {array} comments - Comments
   * @param {string} parentId - Parent id
   * @returns {array|null} Array of posts or null if there is not children
   */
  // _getChildrenComments(comments = [], parentId = '') {
  //   const children = comments.filter(
  //     ({ parent }) => parent?.toString() === parentId
  //   );

  //   return children.length ? children : null;
  // }

  /**
   * This method checks comment exists
   *
   * @async
   * @param {string} postId - Post id
   * @param {string} commentId - Comment id
   * @returns {<Promise>boolean} True if comment exists
   */
  // async checkCommentExists(postId = '', commentId = '') {
  //   const commentsDocument = await Comment.findOne({ post: toObjectId(postId) })
  //     .select('comments')
  //     .lean();

  //   if (!commentsDocument) {
  //     return false;
  //   }

  //   const { comments } = commentsDocument;

  //   const isExists = comments.some(({ _id }) => _id.toString() === commentId);

  //   return !!isExists;
  // }

  /**
   * This method connects other document with comment document
   *
   * @async
   * @param {string} commentId - Comment document id
   * @param {string} field - Field
   * @param {string} id - Connected document id
   * @returns {<Promise>boolean} True if everying ok
   */
  async connectWithDocument(commentId = '', field = '', id = '') {
    const commentDocument = await Comment.findById(commentId).select(
      'comments'
    );

    commentDocument[field] = toObjectId(id);

    await commentDocument.save();

    return true;
  }

  /**
   * This method deletes a comment
   *
   * @async
   * @param {string} id - Comment id
   * @returns {<Promise>boolean} True if everything is ok
   */
  async delete(id = '') {
    const objectId = toObjectId(id);
    const status = await Comment.findByIdAndDelete(objectId);

    return status;
  }
}

module.exports = new CommentService();
