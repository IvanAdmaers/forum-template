const ApiError = require('../../exceptions/ApiError');
const UserService = require('../../services/UserService');
const TokenService = require('../../services/TokenService');
const CookieService = require('../../services/CookieService');
const MailService = require('../../services/MailService');
const LogService = require('../../services/LogService');
const PasswordService = require('../../services/PasswordService');
const RiskService = require('../../services/RiskService');
const ImageService = require('../../services/ImageService');

const UserDto = require('../../dtos/UserDto');
const PostDto = require('../../dtos/PostDto');
const AuthorDto = require('../../dtos/AuthorDto');
const RatingDto = require('../../dtos/RadingDto');

const { getPaginationData, getGravatar } = require('../../utills');
const { getBanInfo } = require('../utills');

const { SOCKET_USER_DISCONNECT_EVENT } = require('../../constants/sockets');
const { triggerSocketEvent } = require('../helpers');

// User registration
exports.registration = async (req, res, next) => {
  try {
    const { email, username, password } = req.body.user;
    const { clientIp, userAgent } = req;

    // Check risk
    const shouldLetAction = await RiskService.shouldLetAction(
      clientIp,
      'registration'
    );

    if (!shouldLetAction) {
      return next(ApiError.badRequest('Try again later'));
    }

    // User registration
    const userImage = getGravatar(email);

    const user = await UserService.registration(
      email,
      username,
      userImage,
      password
    );

    // Log action
    await LogService.action(user._id, 'registration', clientIp, userAgent);

    // Risk action
    await RiskService.add(clientIp, 'registration', userAgent);

    // Get access token
    const accessToken = TokenService.createAccessToken(
      user._id,
      user.username,
      user.roles
    );

    // Get refresh token
    const refreshToken = TokenService.createRefreshToken(user._id);

    // Save refresh token in DB
    await TokenService.saveRefreshToken(user._id, refreshToken);

    // Set access and refresh tokens to cookies
    CookieService.setAccessToken(res, accessToken);
    CookieService.setRefreshToken(res, refreshToken);

    // Send confirmation mail
    const { token: confirmationToken, code: confirmationCode } =
      TokenService.createEmailConfirmationData(user._id);

    MailService.createEmailConfirmation(user._id, confirmationCode);

    const confirmationLink = `${process.env.CLIENT_URL}/email/${confirmationToken}`;

    // I removed await below deliberately
    MailService.sendConfirmationMail(email, confirmationLink);

    const newUser = await UserService.findByUsername(user.username);

    const shouldIncludePrivateData = true;

    const userDto = new UserDto(newUser, shouldIncludePrivateData);

    return res.json({ user: userDto });
  } catch (e) {
    return next(e);
  }
};

exports.authentication = async (req, res, next) => {
  try {
    const { clientIp, userAgent } = req;
    const username = req.body.user?.username?.trim();
    const password = req.body.user?.password;
    const errorMsg = 'Invalid username or password';

    if (!username) {
      return next(ApiError.badRequest('Enter username'));
    }

    if (!password) {
      return next(ApiError.badRequest('Enter password'));
    }

    // Check risk
    const shouldLetAction = await RiskService.shouldLetAction(
      clientIp,
      'authentication'
    );

    if (!shouldLetAction) {
      return next(ApiError.unprocessableEntity('Try again later'));
    }

    // Find user
    const user = await UserService.findByUsername(username);

    if (!user) {
      return next(ApiError.badRequest(errorMsg));
    }

    // Check password
    const passwordMatch = await PasswordService.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      await RiskService.add(clientIp, 'authentication', userAgent);
      return next(ApiError.badRequest(errorMsg));
    }

    // Check has the user ban
    const banDocumentId = user.bans[user.bans.length - 1]?.toString();

    const banInfo = await getBanInfo(banDocumentId);

    if (banInfo.status) {
      CookieService.cleanCookie(res, 'refresh-token');
      CookieService.cleanCookie(res, 'access-token');

      return next(ApiError.forbidden(`Account is blocked. ${banInfo.message}`));
    }

    /* Ok, let's authorize this user */

    // Log action
    await LogService.action(user._id, 'authorization', clientIp, userAgent);

    // New access token
    const accessToken = TokenService.createAccessToken(
      user._id,
      user.username,
      user.roles
    );

    // New refresh token
    const refreshToken = TokenService.createRefreshToken(user._id);

    // Save refresh token in DB
    await TokenService.saveRefreshToken(user._id, refreshToken);

    // Set access and refresh tokens to cookies
    CookieService.setAccessToken(res, accessToken);
    CookieService.setRefreshToken(res, refreshToken);

    const shouldIncludePrivateData = true;

    const userDto = new UserDto(user, shouldIncludePrivateData);

    return res.json({ user: userDto });
  } catch (e) {
    return next(e);
  }
};

exports.posts = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const { username } = req.params;
    const { page: queryPage, limit: queryLimit } = req.query;

    const user = await UserService.findByUsername(username);

    if (!user) {
      return next(ApiError.badRequest('User was not found'));
    }

    const { _id: postsUserId } = user;

    const postsCount = await UserService.getPostsCount(postsUserId);

    const { page, limit, startIndex, numberOfPages } = getPaginationData(
      queryPage,
      queryLimit,
      postsCount
    );

    const postsList = await UserService.getPosts(
      postsUserId,
      limit,
      startIndex
    );

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

exports.getUserData = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const { username } = req.params;

    const user = await UserService.findByUsername(username);

    if (!user) {
      return next(ApiError.badRequest('User was not found'));
    }

    const banDocumentId = user.bans[user.bans.length - 1]?.toString();

    const banInfo = await getBanInfo(banDocumentId);

    user.ban = banInfo;

    const shouldIncludePrivateData = user._id.toString() === userId;

    const userDTO = new UserDto(user, shouldIncludePrivateData);

    const authenticated = shouldIncludePrivateData;

    return res.json({ user: userDTO, authenticated });
  } catch (e) {
    return next(e);
  }
};

exports.avatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const image = req?.files?.image;

    if (!image) {
      return next(ApiError.badRequest('Image is not defined'));
    }

    const maxSize = 5 * (1024 * 1024);

    const { error } = await ImageService.isAvailableForUpload(image, maxSize);

    if (error) {
      return next(ApiError.badRequest(error));
    }

    const { url } = await ImageService.upload(image);

    await UserService.setUserAvatar(userId, url);

    return res.json({ url });
  } catch (e) {
    return next(e);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    triggerSocketEvent(req, SOCKET_USER_DISCONNECT_EVENT, userId);

    CookieService.cleanCookie(res, 'refresh-token');
    CookieService.cleanCookie(res, 'access-token');

    return res.json({ success: true });
  } catch (e) {
    return next(e);
  }
};
