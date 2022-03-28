const PostService = require('../services/PostService');
const CommentService = require('../services/CommentService');
const RatingService = require('../services/RatingService');
const ApiError = require('../exceptions/ApiError');
const CommentDto = require('../dtos/CommentDto');

const { convertEditorJSToHTML, sanitizeHTML } = require('../utills');

exports.add = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { postSlug } = req.params;
    const { parentId, body } = req.body.comment;

    const { blocks } = body;

    /* Checks */

    // Check post exists
    const post = await PostService.get(postSlug, '_id');

    if (!post) {
      return next(ApiError.badRequest('Post was not found'));
    }

    const postId = post._id.toString();

    // Check parentId exists
    if (parentId) {
      const isExists = await PostService.isCommentExists(postId, parentId);

      if (!isExists) {
        return next(ApiError.badRequest('Parent comment id does not exist'));
      }
    }

    // Add comment
    const HTML = convertEditorJSToHTML(blocks);

    const sanitizedHTML = sanitizeHTML('comment', HTML);

    const commentId = await CommentService.add(
      postId,
      userId,
      parentId,
      blocks,
      sanitizedHTML
    );

    // Add comment to post
    await PostService.addNewComment(postId, commentId);

    // Comment data
    const commentData = await CommentService.get(commentId);

    const comment = new CommentDto(commentData, userId);

    return res.status(201).json({ ...comment });
  } catch (e) {
    return next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { postSlug } = req.params;
    const userId = req?.user?.id;

    const post = await PostService.getBySlug(postSlug, '_id');

    if (!post) {
      return next(ApiError.badRequest('Post was not found'));
    }

    const postId = post._id.toString();

    const commentsList = await PostService.getComments(postId);

    const comments = commentsList.map(
      (comment) => new CommentDto(comment, userId)
    );

    return res.json({ comments, userId });
  } catch (e) {
    return next(e);
  }
};

exports.vote = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const vote = +req.params.vote;
    const { postSlug, commentId } = req.params;

    const availibleValues = [1, 0, -1];

    // Check vote value correct
    if (typeof vote !== 'number' || !availibleValues.includes(vote)) {
      return next(ApiError.badRequest('Vote param is incorrect'));
    }

    const post = await PostService.get(postSlug, '_id');

    // Check post exists
    if (!post) {
      return next(ApiError.badRequest('Post was not found'));
    }

    const { _id: postId } = post;

    // Check comment exists
    const isExists = await PostService.isCommentExists(postId, commentId);

    if (!isExists) {
      return next(ApiError.badRequest('Comment was not found'));
    }

    const comment = await CommentService.get(commentId);

    const commentAuthorId = comment.author._id.toString();

    // Vote
    const { error } = await RatingService.vote(
      'comment',
      commentId,
      commentAuthorId,
      vote,
      userId
    );

    if (error) {
      return next(ApiError.badRequest(error));
    }

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
