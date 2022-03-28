const ApiError = require('../exceptions/ApiError');
const UserService = require('../services/UserService');
const GroupService = require('../services/GroupService');
const GroupDto = require('../dtos/GroupDto');
const PostDto = require('../dtos/PostDto');
const AuthorDto = require('../dtos/AuthorDto');
const RatingDto = require('../dtos/RadingDto');

const { getPaginationData } = require('../utills');
const { getBanInfo } = require('./utills');

const paramToNumber = (n = 0) => {
  const number = parseInt(n, 10);

  return !number ? 1 : number;
};

exports.create = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      image,
      url,
      title,
      tags,
      description = '',
      isNSFW,
    } = req.body.group;

    const groupUrl = await GroupService.create({
      author: id,
      image,
      url,
      title,
      tags,
      description,
      isNSFW,
    });

    return res.status(201).json({ url: groupUrl });
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res) => {
  const { page: pageQuery, limit: limitQuery } = req.query;

  // Pagination
  const page = paramToNumber(pageQuery);
  const limit = limitQuery ? paramToNumber(limitQuery) : 10;
  const startIndex = (page - 1) * limit;
  const total = await GroupService.totalCount();
  const numberOfPages = Math.ceil(total / limit);

  const groups = await GroupService.get(limit, startIndex);

  return res.json({ groups, currentPage: page, numberOfPages });
};

exports.get = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { url } = req.params;

    const groupInfo = await GroupService.getData(url, userId);

    if (!groupInfo) {
      return next(ApiError.badRequest('Group was not found'));
    }

    // Ban
    const groupBanDocumentId =
      groupInfo.group.bans[groupInfo.group.bans.length - 1]?.toString();

    const banInfo = await getBanInfo(groupBanDocumentId);

    groupInfo.group.ban = banInfo;

    const groupDTO = new GroupDto(groupInfo.group);

    const user = {
      isMember: groupInfo.isMember,
    };

    return res.json({ group: groupDTO, user });
  } catch (e) {
    return next(e);
  }
};

exports.join = async (req, res, next) => {
  try {
    const { url: groupUrl } = req.params;
    const { id: userId } = req.user;

    // 1. Check group exists and get group id
    const groupId = await GroupService.getIdBySlug(groupUrl);

    if (!groupId) {
      return next(ApiError.badRequest('Group was not found'));
    }

    // 2. Check if user alredy joined
    const isMember = await UserService.isMember(userId, groupId);

    if (isMember) {
      return next(ApiError.badRequest('User is already a member'));
    }

    // 3. Join user
    await UserService.joinGroup(userId, groupId);
    await GroupService.join(userId, groupId);

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};

exports.unjoin = async (req, res, next) => {
  try {
    const { url: groupUrl } = req.params;
    const { id: userId } = req.user;

    // 1. Check group exists
    const groupId = await GroupService.getIdBySlug(groupUrl);

    if (!groupId) {
      return next(ApiError.badRequest('Group was not found'));
    }

    // 2. Check if user isn't joined
    const isMember = await UserService.isMember(userId, groupId);

    if (!isMember) {
      return next(ApiError.badRequest('User is not a group member'));
    }

    // 3. Unjoin
    await UserService.unjoinGroup(userId, groupId);
    await GroupService.unjoin(userId, groupId);

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};

exports.isMember = async (req, res, next) => {
  try {
    const { url: groupUrl } = req.params;
    const userId = req.user?.id;

    // 1. Check user auth
    if (!userId) {
      return res.json({ isMember: false });
    }

    // 2. Check group exists
    const groupId = await GroupService.getIdBySlug(groupUrl);

    if (!groupId) {
      return next(ApiError.badRequest('Group was not found'));
    }

    // 3. Check is member
    const isMember = await UserService.isMember(userId, groupId);

    return res.json({ isMember });
  } catch (e) {
    return next(e);
  }
};

exports.searchByUserGroups = async (req, res, next) => {
  try {
    const { q } = req.query;
    const { id } = req.user;

    if (!q || !q.trim()) {
      return next(ApiError.badRequest('An empty search term has been set'));
    }

    const groupsList = await GroupService.findUserGroups(id, q);

    const groups = groupsList.map((group) => new GroupDto(group));

    return res.json({ groups });
  } catch (e) {
    return next(e);
  }
};

exports.topGroups = async (req, res, next) => {
  try {
    const { page: reqPage, limit: reqLimit } = req.query;

    const groupsCount = await GroupService.totalCount();

    const { page, limit, startIndex, numberOfPages } = getPaginationData(
      reqPage,
      reqLimit,
      groupsCount
    );

    const groupsList = await GroupService.getTops(startIndex, limit);

    const groups = groupsList.map((group) => new GroupDto(group));

    return res.json({ groups, currentPage: page, numberOfPages });
  } catch (e) {
    return next(e);
  }
};

exports.posts = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const { url: groupSlug } = req.params;
    const { page: reqPage, limit: reqLimit } = req.query;

    const totalDocuments = await GroupService.getPostsCount(groupSlug);

    if (totalDocuments === null) {
      return next(ApiError.badRequest('Group was not found'));
    }

    const { page, limit, startIndex, numberOfPages } = getPaginationData(
      reqPage,
      reqLimit,
      totalDocuments
    );

    const postsList = await GroupService.getPosts(groupSlug, startIndex, limit);

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

exports.isUrlAvailable = async (req, res, next) => {
  try {
    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
