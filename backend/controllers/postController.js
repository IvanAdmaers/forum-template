const ApiError = require('../exceptions/ApiError');
const PostService = require('../services/PostService');
const GroupService = require('../services/GroupService');
const RatingService = require('../services/RatingService');
const UserService = require('../services/UserService');
const PostDto = require('../dtos/PostDto');
const AuthorDto = require('../dtos/AuthorDto');
const GroupDto = require('../dtos/GroupDto');
const RatingDto = require('../dtos/RadingDto');

const { USER_DEFAULT_ROLE, USER_MODERATOR_ROLE } = require('../constants/user');

const {
  handleEditorJSImages,
  convertEditorJSToHTML,
  sanitizeHTML,
} = require('../utills');

exports.create = async (req, res, next) => {
  try {
    // TODO: if it's a post to group check its ban status
    // if there is a ban do not add the post
    const { id } = req.user;
    const { title, body, groupId, isNSFW, sendReplies, isOriginalContent } =
      req.body.post;

    const { blocks } = body;

    // Check is user group member
    const isMember =
      groupId === '1' ? true : await GroupService.isMember(id, groupId);

    if (!isMember) {
      return next(ApiError.badRequest('Must be a member of a group'));
    }

    // const [postHTML, previewImage] = await PostService.prepareHTML(body, title);
    const [handledBlocks, previewImage] = await handleEditorJSImages(blocks);

    const HTML = convertEditorJSToHTML(handledBlocks, title);

    const sanitizedHTML = sanitizeHTML('post', HTML);

    const options = {
      authorId: id,
      title,
      body: { blocks: handledBlocks, HTML: sanitizedHTML },
      previewImage,
      groupId,
      isNSFW,
      sendReplies,
      isOriginalContent,
    };

    const { id: newPostId, slug: newPostSlug } = await PostService.create(
      options
    );

    const ratingOptions = {
      postId: newPostId,
      authorId: id,
    };

    // Rating
    const ratingId = await RatingService.create(ratingOptions);

    // Comments

    await Promise.all([
      PostService.connectWithDocument(newPostId, 'rating', ratingId),
      UserService.postToUser('add', id, newPostId),
    ]);

    if (groupId !== '1') {
      await GroupService.postToGroup('add', groupId, newPostId);
    }

    return res.status(201).json({ url: newPostSlug });
  } catch (e) {
    return next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const { slug } = req.params;

    // Find post
    const post = await PostService.get(slug);

    if (!post) {
      return next(ApiError.badRequest('Post was not found'));
    }

    const postDTO = new PostDto(post);
    const authorDTO = new AuthorDto(post.author);
    const ratingDTO = new RatingDto(post.rating, userId);

    const groupOrUser = {
      type: !post.group ? 'user' : 'group',
      data: !post.group ? new AuthorDto(post.user) : new GroupDto(post.group),
    };

    const { type, data } = groupOrUser;

    return res.json({
      post: postDTO,
      author: authorDTO,
      [type]: data,
      rating: ratingDTO,
    });
  } catch (e) {
    return next(e);
  }
};

exports.user = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const userId = req.user?.id;
    const userRoles = req.user?.roles;

    // Find post
    const post = await PostService.get(slug, 'author user group');

    if (!post) {
      return next(ApiError.badRequest('Post was not found'));
    }

    const postData = {
      authorId: post.author._id,
      userId: post.user?._id,
      groupId: post.group?._id,
    };

    const user = await PostService.userRoles(postData, userId, userRoles);

    const rating = new RatingDto(post.rating, userId);

    return res.json({ user, vote: rating.userVote });
  } catch (e) {
    return next(e);
  }
};

exports.vote = async (req, res, next) => {
  try {
    const vote = +req.params.vote;
    const { slug } = req.params;
    const { id: userId } = req.user;

    const availibleValues = [1, 0, -1];

    // Check vote value correct
    if (typeof vote !== 'number' || !availibleValues.includes(vote)) {
      return next(ApiError.badRequest('Vote param is incorrect'));
    }

    const post = await PostService.get(slug, '_id');

    // Check post exists
    if (!post) {
      return next(ApiError.badRequest('Post was not found'));
    }

    const { _id: postId } = post;

    // Vote
    const postAuthorId = post.author._id.toString();

    const { error } = await RatingService.vote(
      'post',
      postId,
      postAuthorId,
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

exports.edit = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { slug } = req.params;
    const { title, body, groupId, isNSFW, sendReplies, isOriginalContent } =
      req.body.post;

    const { blocks } = body;

    // Check post exists
    const isExists = await PostService.getBySlug(slug, '_id');

    if (!isExists) {
      return next(ApiError.badRequest('Post does not exist'));
    }

    // Check is user group member
    const isMember =
      groupId === '1' ? true : await GroupService.isMember(userId, groupId);

    if (!isMember) {
      return next(ApiError.badRequest('Must be a member of a group'));
    }

    // Check is post author
    const isAuthor = await PostService.isAuthor(userId, slug);

    if (!isAuthor) {
      return next(ApiError.badRequest('You must be an author of the post'));
    }

    const [handledBlocks, previewImage] = await handleEditorJSImages(blocks);

    const HTML = convertEditorJSToHTML(handledBlocks, title);

    const sanitizedHTML = sanitizeHTML('post', HTML);

    const options = {
      title,
      body: { blocks: handledBlocks, HTML: sanitizedHTML },
      previewImage,
      groupId,
      isNSFW,
      sendReplies,
      isOriginalContent,
    };

    // Update post
    await PostService.update(slug, options);

    return res.json({ url: slug, title, HTML });
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  const getParamValue = (value) => {
    const num = parseInt(value, 10);

    if (typeof num !== 'number') return null;

    if (num < 0) return null;

    if (num > 100) return 100;

    return num;
  };

  try {
    const userId = req?.user?.id;

    const { page: pageQuery, limit: limitQuery } = req.query;

    // Pagination
    const limit = getParamValue(limitQuery) || 10;
    const page = getParamValue(pageQuery) || 1;
    const startIndex = (page - 1) * limit;
    const total = await PostService.totalCount();
    const numberOfPages = Math.ceil(total / limit);

    const postsList = await PostService.getPosts(limit, startIndex);

    const posts = postsList.map((post) => {
      const currentPost = post;

      const postDTO = new PostDto(currentPost);
      const authorDTO = new AuthorDto(currentPost.author);
      const ratingDTO = new RatingDto(currentPost.rating, userId);

      return { post: postDTO, author: authorDTO, rating: ratingDTO };
    });

    return res.json({ posts, currentPage: page, numberOfPages });
  } catch (e) {
    return next(e);
  }
};

exports.top = async (req, res, next) => {
  try {
    // to set a max limit
    const limit = +req.query.limit || 3;

    return res.json({ todo: true, limit });
  } catch (e) {
    return next(e);
  }
};

exports.pin = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { slug, postId } = req.params;
    const { action } = req.query;

    // Checks
    if (action !== 'pin' && action !== 'unpin') {
      return next(ApiError.badRequest('Action type is unknown'));
    }

    const groupId = await GroupService.getGroupIdBySlug(slug);

    if (!groupId) {
      return next(ApiError.badRequest('Group was not found'));
    }

    const groupAuthor = await GroupService.getGroupAuthor(groupId);

    const isGroupAuthor = groupAuthor === userId;

    // If the user is not a group author checks has user a moderator role
    if (!isGroupAuthor) {
      const roles = [USER_DEFAULT_ROLE, USER_MODERATOR_ROLE];

      const hasRoles = await UserService.hasRoles(userId, roles);

      if (!hasRoles) {
        return next(ApiError.forbidden('Action is not allowed'));
      }
    }

    // Check post exists
    const isPostExists = await GroupService.postExists(groupId, postId);

    if (!isPostExists) {
      return next(ApiError.badRequest('Post was not found'));
    }

    // Pin or unpin action

    // Pin
    if (action === 'pin') {
      const isPostPinned = await GroupService.isPostPinned(groupId, postId);

      if (isPostPinned) {
        return next(ApiError.badRequest('Post is already pinned'));
      }

      await GroupService.pinPost(groupId, postId, userId);

      return res.json({ success: true });
    }

    // Unpin
    const isPostPinned = await GroupService.isPostPinned(groupId, postId);

    if (!isPostPinned) {
      return next(ApiError.badRequest('Post was not pinned'));
    }

    await GroupService.unpinPost(groupId, postId);

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
