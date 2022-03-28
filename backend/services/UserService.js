const User = require('../models/UserModel');

const PasswordService = require('./PasswordService');
const PostService = require('./PostService');

const { toObjectId } = require('../utills');

class UserService {
  /**
   * This function finds users by param
   *
   * @async
   * @param {string} param Email, username, or id
   * @param {string} value Value
   * @returns {(null|Promise<object>)} User info object or null
   */
  async _findUser(param = '', value = '') {
    const searchParam = param !== 'id' ? param : '_id';

    const user = await User.findOne({ [searchParam]: value })
      // .populate('tokens')
      .populate('confirmationCodes')
      .populate('verification')
      .lean();

    return user;
  }

  /**
   * This method finds user by email
   *
   * @async
   * @param {string} email User username
   * @returns {(null|Object)} User data object or null
   */
  async findByEmail(email = '') {
    const regex = new RegExp(`^${email}$`, 'i');

    const user = await this._findUser('email', regex);

    return user;
  }

  /**
   * This method finds user by username
   *
   * @async
   * @param {string} username User username
   * @returns {(null|Object)} User data object or null
   */
  async findByUsername(username = '') {
    const regex = new RegExp(`^${username}$`, 'i');

    const user = await this._findUser('username', regex);

    return user;
  }

  /**
   * This method finds user by id
   *
   * @async
   * @param {string} id - User id
   * @returns {(null|Object)} User data object or null
   */
  async findById(id = '') {
    const user = await this._findUser('id', toObjectId(id));

    return user;
  }

  /**
   * This method does user registration
   *
   * @async
   * @param {string} email - User email
   * @param {string} username - User username
   * @param {string} image - User image url
   * @param {string} password - User password
   * @returns {Promise<object>} - User data
   */
  async registration(email = '', username = '', image = '', password = '') {
    const hashedPassword = await PasswordService.hash(password);

    const newUser = new User({
      email,
      username,
      image,
      password: hashedPassword,
    });

    const createdUser = await newUser.save();

    return createdUser;
  }

  /**
   * This method connects document with user
   *
   * @async
   * @param {string} userId - User id
   * @param {string} colectionId - Document id
   * @param {string} field - Field name
   * @returns {Promise<boolean>} True if everything good
   */
  // async connectWithRefreshTokensCollection(userId = '', colectionId = '') {
  //   const user = await User.findById(userId);
  //   user.refreshTokens = colectionId;
  //   await user.save();

  //   return true;
  // }
  async connectWithDocument(userId = '', documentId = '', field = '') {
    const user = await User.findById(userId);
    user[field] = documentId;
    await user.save();

    return true;
  }

  /**
   * This method changes user password
   *
   * @async
   * @param {string} userId - User id
   * @param {string} password - New password
   * @returns {Promise<boolean}
   */
  async changePassword(userId = '', password = '') {
    const hashedPassword = await PasswordService.hash(password);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return true;
  }

  /**
   * This method checks if user group memeber
   *
   * @async
   * @param {string} userId - User id
   * @param {string} groupId - Group Id
   * @returns {<Promise>boolean} True if memeber
   */
  async isMember(userId = '', groupId = '') {
    const user = await User.findById(userId).select('groups').lean();

    const { groups } = user;

    if (!groups || !groups.length) {
      return false;
    }

    for (let i = 0; i < groups.length; i += 1) {
      const id = groups[i].toString();

      if (groupId === id) {
        return true;
      }
    }

    return false;
  }

  /**
   * This method joins user to group
   *
   * @async
   * @param {string} userId - User id
   * @param {string} groupId - Group id
   * @returns {<Promise>boolean} True if everything ok
   */
  async joinGroup(userId = '', groupId = '') {
    await User.findByIdAndUpdate(userId, {
      $push: { groups: toObjectId(groupId) },
    });

    return true;
  }

  /**
   * This method unjoins user to group
   *
   * @async
   * @param {string} userId - User id
   * @param {string} groupId - Group id
   * @returns {<Promise>boolean} True if everything ok
   */
  async unjoinGroup(userId = '', groupId = '') {
    await User.findByIdAndUpdate(userId, {
      $pull: { groups: toObjectId(groupId) },
    });

    return true;
  }

  /**
   * This method adds post to user model
   *
   * @async
   * @param {string} type - Type of action. Add or delete
   * @param {string} userId - User id
   * @param {string} postId - Post id
   * @returns {<Promise>boolean} True if everything ok
   */
  async postToUser(type = '', userId = '', postId = '') {
    const postObjectId = toObjectId(postId);

    const action = type === 'add' ? '$push' : '$pull';

    await User.findByIdAndUpdate(userId, {
      [action]: { posts: postObjectId },
    });

    return true;
  }

  /**
   * This method checks does the user have roles
   *
   * @param {string} userId - User id
   * @param {array} requiredRoles - Required roles
   * @returns {<Promise>boolean} True if everything ok
   */
  async hasRoles(userId = '', requiredRoles = []) {
    const { roles } = await User.findById(userId).select('roles').lean();

    const hasRoles = requiredRoles.every((role) => roles.includes(role));

    return Boolean(hasRoles);
  }

  /**
   * This method gets posts that user created only for its profile
   *
   * @async
   * @param {string} userId - User id
   * @param {number} limit - Limit
   * @param {number} skip - Skip
   * @returns {<Promise>array} Array of posts
   */
  async getPosts(userId = '', limit = 3, skip = 0) {
    if (limit) {
      // temporary remove usage because of problems
    }

    const { posts } = await User.findById(userId)
      .select('_id')
      .lean()
      .populate({
        path: 'posts',
        select: 'user slug moderation',
        options: {
          skip,
          sort: {
            createdAt: -1,
          },
        },
        populate: {
          path: 'moderation',
        },
      })
      .lean();

    const postsFiltered = posts.filter(({ user }) => Boolean(user));

    const postsPromises = [];

    for (let i = 0; i < postsFiltered.length; i += 1) {
      const { slug } = postsFiltered[i];

      postsPromises.push(PostService.get(slug));
    }

    const postsList = await Promise.all(postsPromises);

    return postsList;
  }

  /**
   * This method gets user posts count
   *
   * @async
   * @param {string} userId - User id
   * @returns {<Promise>number} Number of posts
   */
  async getPostsCount(userId = '') {
    const postsList = await User.findById(userId)
      .select('_id')
      .lean()
      .populate({ path: 'posts' })
      .select('user')
      .lean();

    const { posts } = postsList;

    const postsFiltered = posts.filter(({ user }) => !!user);

    return postsFiltered.length;
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

    const count = await User.countDocuments({
      username: searchQuery,
    });

    return count;
  }

  /**
   * This method finds users by search query
   *
   * @async
   * @param {string} q - Search query
   * @param {number} limit - Limit
   * @param {number} skip - Skip
   * @returns {<Promise>Array} - Groups array
   */
  async search(q = '', limit = 0, skip = 0) {
    const searchQuery = new RegExp(q, 'i');

    const users = await User.find({
      username: searchQuery,
    })
      .limit(limit)
      .skip(skip)
      .lean();

    return users;
  }

  /**
   * This method sets image to user
   *
   * @async
   * @param {string} userId - User id
   * @param {string} imageUrl - Image url
   */
  async setUserAvatar(userId = '', imageUrl = '') {
    await User.findByIdAndUpdate(userId, { image: imageUrl });

    return true;
  }

  /**
   * This method updates user karma
   *
   * @async
   * @param {string} value - Value to update karma
   * @param {string} userId - User id
   * @returns {<Promise>boolean} True if everything ok
   */
  async updateKarma(value = 0, userId = '') {
    await User.findByIdAndUpdate(userId, { $inc: { karma: value } });

    return true;
  }

  /**
   * This method removes a field in document
   *
   * @async
   * @param {string} userId - User id
   * @param {string} field - Field
   * @returns {<Promise>boolean} True if everything ok
   */
  async removeDocumentField(userId = '', field = '') {
    await User.findByIdAndUpdate(userId, { $unset: { [field]: 1 } });

    return true;
  }

  /**
   * This method checks has user a specific field
   *
   * @async
   * @param {string} userId - User id
   * @param {string} field - Field
   * @returns {<Promise>boolean} Field value or null
   */
  async hasField(userId = '', field = '') {
    const user = await User.findById(userId).select(field).lean();

    const hasField = user[field] ?? null;

    return hasField;
  }

  /**
   * This method adds new ban document to bans array
   *
   * @async
   * @param {string} userId - User id
   * @param {string} banId - Ban id
   * @returns {<Promise>boolean} True if everything ok
   */
  async addBan(userId = '', banId = '') {
    await User.findByIdAndUpdate(userId, {
      $push: { bans: toObjectId(banId) },
    }).lean();

    return true;
  }

  /**
   * This method gets a user chats
   *
   * @async
   * @param {string} userId - User id
   * @returns {<Promise>Array} User chats
   */
  async getChats(userId = '') {
    const { chats } = await User.findById(userId).select('chats').lean();

    return chats;
  }

  /**
   * This method adds a chat to user
   *
   * @async
   * @param {string} userId - User id
   * @param {string} chatId - Chat id
   * @return {<Promise>boolean} True if everything is ok
   */
  async addChat(userId = '', chatId = '') {
    await User.findByIdAndUpdate(userId, {
      $push: { chats: toObjectId(chatId) },
    });

    return true;
  }
}

module.exports = new UserService();
