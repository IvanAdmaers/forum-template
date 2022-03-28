const UserService = require('./UserService');
const PostService = require('./PostService');
const Group = require('../models/GroupModel');

const { toObjectId } = require('../utills');

class GroupService {
  /**
   * This method checks group exists by slug
   *
   * @async
   * @param {string} slug - Group slug
   * @returns {Promise<boolean>} True if exists
   */
  async _checkGroupExistsBySlug(slug = '') {
    const candidate = await Group.findOne({ slug }).lean();

    return !!candidate;
  }

  /**
   * This method creates a group
   *
   * @async
   * @param {Object} params - Group data object
   * @property {string} author - author id
   * @property {string} image - an image url
   * @property {string} url - group url
   * @property {title} title - group title
   * @property {Array} tags - group tags
   * @property {string} description - group description
   * @property {boolean} isNSFW - is NSFW group
   * @returns {Promise<string>} - Group url if everything ok
   */
  async create(params) {
    const {
      author,
      image,
      url,
      title,
      tags,
      description,
      isNSFW = false,
      // slug,
    } = params;

    // const self = this;

    // let groupSlug = slug || slugGenerator(title);

    // const candidate = await this._checkGroupExistsBySlug(groupSlug);

    // if (candidate) {
    //   groupSlug += `-${uuid().slice(0, 4)}`;

    //   return self.create({ ...params, slug: groupSlug });
    // }

    const groupImage = image || process.env.DEFAULT_GROUP_PREVIEW_URL;

    const members = [{ user: toObjectId(author) }];

    const newGroup = new Group({
      author: toObjectId(author),
      image: groupImage,
      slug: url,
      title,
      tags,
      description,
      isNSFW,
      membersCount: 1,
      members,
    });

    const createdGroup = await newGroup.save();

    await UserService.joinGroup(author, createdGroup._id);

    return createdGroup.slug;
  }

  /**
   * This method returns total count of groups
   *
   * @async
   * @returns {Promise<number>} Count of groups
   */
  async totalCount() {
    const count = await Group.countDocuments();

    return count;
  }

  /**
   * This method gets groups
   *
   * @async
   * @param {number} limit - Limit
   * @param {number} skip - Skip
   * @returns {Promise} List of groups
   */
  async get(limit = 0, skip = 0) {
    const groups = await Group.find()
      .limit(limit)
      .skip(skip)
      .sort({ _id: -1 })
      .select('-__v')
      .lean();

    const groupsFiltered = this._changeUnderscopeIdToId(groups);

    return groupsFiltered;
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

    const count = await Group.countDocuments({
      $or: [{ title: searchQuery }, { description: searchQuery }],
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

    const groups = await Group.find({
      $or: [{ title: searchQuery }, { description: searchQuery }],
    })
      .limit(limit)
      .skip(skip)
      .select('-__v')
      .lean();

    const groupsFiltered = this._changeUnderscopeIdToId(groups);

    return groupsFiltered;
  }

  /**
   * This method changes _id to id
   *
   * @param {Array} items - Array of items
   * @returns {Array} - Filtered array
   */
  _changeUnderscopeIdToId(items = []) {
    const itemsArray = [...items];

    const itemsArrayFiltered = itemsArray.map((item) => {
      const group = item;

      group.id = group._id;
      delete group._id;

      return group;
    });

    return itemsArrayFiltered;
  }

  /**
   * This method gets group info by slug
   *
   * @async
   * @param {string} slug - Group slug
   * @returns {<Promise>Object} Data object or null
   */
  async getData(slug = '', userId = '') {
    const group = await Group.findOne({ slug })
      .populate('verification')
      .select('-__v')
      .lean();

    if (!group) {
      return null;
    }

    let isMember = false;

    if (!userId) {
      return { group, isMember };
    }

    const { members } = group;

    for (let i = 0; i < members.length; i += 1) {
      const id = members[i].user.toString();

      if (userId === id) {
        isMember = true;
        break;
      }
    }

    return {
      group,
      isMember,
    };
  }

  /**
   * This method gets group id by slug
   *
   * @async
   * @param {string} slug - Group slug
   * @returns {<Promise>string} - Group id or null
   */
  async getIdBySlug(slug = '') {
    const group = await Group.findOne({ slug }).select('_id').lean();

    if (!group) {
      return null;
    }

    return group._id.toString();
  }

  /**
   * This method joins user to group
   *
   * @async
   * @param {string} userId - User id
   * @param {string} groupId - Group id
   * @returns {<Promise>boolean} True if everying ok
   */
  async join(userId = '', groupId = '') {
    const newMember = { user: toObjectId(userId) };

    await Group.findByIdAndUpdate(groupId, {
      $push: { members: newMember },
      $inc: { membersCount: 1 },
    });

    return true;
  }

  /**
   * This method unjoins user to group
   *
   * @async
   * @param {string} userId - User id
   * @param {string} groupId - Group id
   * @returns {<Promise>boolean} True if everying ok
   */
  async unjoin(userId = '', groupId = '') {
    const newMember = { user: toObjectId(userId) };

    await Group.findByIdAndUpdate(groupId, {
      $pull: { members: newMember },
      $inc: { membersCount: -1 },
    });

    return true;
  }

  async findUserGroups(userId = '', q = '') {
    const searchQuery = new RegExp(q, 'i');

    const groups = await Group.find({
      members: { $elemMatch: { user: toObjectId(userId) } },
      $or: [{ title: searchQuery }, { slug: searchQuery }],
    }).lean();

    return groups;
  }

  /**
   * This method gets group author
   *
   * @async
   * @param {string} groupId - Group id
   * @returns {<Promise>string} Group author id
   */
  async getGroupAuthor(groupId = '') {
    const { author } = await Group.findById(groupId).select('author').lean();

    return author.toString();
  }

  /**
   * This method checks is user group memeber
   *
   * @async
   * @param {string} userId - User id
   * @param {string} groupId - Group id
   * @returns {<Promise>boolean} True if user is group member
   */
  async isMember(userId = '', groupId = '') {
    const group = await Group.findById(groupId).select('members').lean();

    if (!group) {
      return false;
    }

    const { members } = group;

    if (!members.length) return false;

    const isMember = members.some(({ user }) => user.toString() === userId);

    return isMember;
  }

  /**
   * This method gets the most popular groups id
   *
   * @async
   * @param {number} skip - Skip
   * @param {number} limit - Limit
   * @returns {<Promise>Array} Array of groups id
   */
  async getTops(skip = 0, limit = 3) {
    // Todo: delete old way
    // https://www.tutorialspoint.com/mongodb-aggregation-framework-to-sort-by-length-of-array
    // const groupsList = await Group.aggregate([
    //   { $unwind: '$members' },
    //   { $group: { _id: '$_id', members: { $sum: 1 } } },
    //   { $sort: { members: -1 } },
    //   { $limit: documentsLimit },
    // ]);

    const groups = await Group.find()
      .sort({ membersCount: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return groups;
  }

  /**
   * This method adds post id to group model
   *
   * @async
   * @param {string} type - Action type. Add or delete
   * @param {string} groupId - Group id
   * @param {string} postId - Post id
   * @returns {Promise<boolean>} True if everything ok
   */
  async postToGroup(type = '', groupId = '', postId = '') {
    const postObjectId = toObjectId(postId);

    const action = type === 'add' ? '$push' : '$pull';

    await Group.findByIdAndUpdate(groupId, {
      [action]: { posts: postObjectId },
    });

    return true;
  }

  /**
   * This method gets group posts count
   *
   * @async
   * @param {string} groupSlug - Group slug
   * @returns {<Promise>number} Number of posts or null if group was not found
   */
  async getPostsCount(groupSlug = '') {
    const document = await Group.findOne({ slug: groupSlug })
      .select('posts')
      .lean();

    if (!document) return null;

    const { posts } = document;

    const countOfPosts = posts.length;

    return countOfPosts;
  }

  // /**
  //  * This method gets group posts
  //  *
  //  * @async
  //  * @param {string} slug - Group slug
  //  * @param {number} skip - Count of skip documents
  //  * @param {number} limit - Count of limit documents
  //  * @returns {<Promise>Array} Array of posts id
  //  */
  // async getPosts2(slug = '', skip = 0, limit = 10) {
  //   // .populate('posts')
  //   // .skip(skip)
  //   // .limit(limit)
  //   // doesnt work
  //   //
  //   // const groupPosts = await Group.findOne({ slug })
  //   //   .select('_id')
  //   //   .lean()
  //   //   .populate({
  //   //     path: 'pinnedPosts.post',
  //   //     sort: { pinnedAt: -1 },
  //   //   })
  //   //   .populate({
  //   //     path: 'author',
  //   //     select: 'username image',
  //   //   })
  //   //   .lean()
  //   //   .populate({
  //   //     path: 'posts',
  //   //     skip,
  //   //     limit,
  //   //     sort: { createdAt: -1 },
  //   //   })
  //   //   .lean();
  //   // const { posts, pinnedPosts } = groupPosts;
  //   // console.log(groupPosts);
  //   // if (skip !== 0) {
  //   //   return posts;
  //   // }
  //   // const pinnedPostsList = pinnedPosts.map(({ post }) => {
  //   //   const currentPost = post;
  //   //   currentPost.pinned = true;
  //   //   return currentPost;
  //   // });
  //   // const pinnedPostsIds = pinnedPostsList.map(({ _id }) => _id.toString());
  //   // const postsList = posts.filter(
  //   //   ({ _id }, index) =>
  //   //     !pinnedPostsIds.includes(_id.toString()) ||
  //   //     index + 1 > pinnedPosts.length
  //   // );
  //   // return [...pinnedPostsList, ...postsList];
  // }

  /**
   * This method gets group posts
   *
   * @async
   * @param {string} slug - Group slug
   * @param {number} skip - Count of skip documents
   * @param {number} limit - Count of limit documents
   * @returns {<Promise>Array} Array of posts id
   */
  async getPosts(slug = '', skip = 0, limit = 10) {
    const groupPosts = await Group.findOne({ slug })
      .select('_id')
      .lean()
      .populate({
        path: 'posts',
        select: 'slug createdAt',
        options: {
          sort: { createdAt: -1 },
        },
        skip,
        limit,
      })
      .lean()
      .populate({
        path: 'pinnedPosts.post',
        select: 'slug',
      })
      .lean();

    const { posts: postsList, pinnedPosts: pinnedPostsList } = groupPosts;

    const postsPromises = [];

    if (skip === 0) {
      for (let i = 0; i < pinnedPostsList.length; i += 1) {
        const { slug: postSlug } = pinnedPostsList[i].post;

        postsPromises.push(PostService.get(postSlug));
      }
    }

    for (let i = 0; i < postsList.length; i += 1) {
      const { slug: postSlug } = postsList[i];

      if (pinnedPostsList.find(({ post }) => post.slug === postSlug)) {
        // eslint-disable-next-line no-continue
        continue;
      }

      postsPromises.push(PostService.get(postSlug));
    }

    const posts = await Promise.all(postsPromises);

    // Set pinned posts
    pinnedPostsList.forEach(({ post }) => {
      const postFromList = posts.find(
        ({ _id }) => _id.toString() === post._id.toString()
      );

      postFromList.pinned = true;
    });

    return posts;
  }

  /**
   * This method gets group id by slug
   *
   * @async
   * @param {string} slug - Group slug
   * @returns {<Promise>string} Group id
   */
  async getGroupIdBySlug(slug = '') {
    const group = await Group.findOne({ slug }).select('_id').lean();

    if (!group) return null;

    const { _id } = group;

    return _id.toString();
  }

  /**
   * This method checks post exists
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} postId - Post id
   * @returns {<Promise>boolean} True if post exists
   */
  async postExists(groupId = '', postId = '') {
    const { posts } = await Group.findById(groupId).select('posts').lean();

    const exists = posts.some((post) => post.toString() === postId);

    return Boolean(exists);
  }

  /**
   * This method checks is post pinned
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} postId - Post id
   * @returns {<Promise>boolean} True if post pinned
   */
  async isPostPinned(groupId = '', postId = '') {
    const { pinnedPosts } = await Group.findById(groupId)
      .select('pinnedPosts')
      .lean();

    const isPinned = pinnedPosts.some(({ post }) => post.toString() === postId);

    return Boolean(isPinned);
  }

  /**
   * This method does post pin
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} postId - Post id
   * @param {string} userId - User id
   * @returns {<Promise>boolean} True if everything ok
   */
  async pinPost(groupId = '', postId = '', userId = '') {
    const pinnedPost = {
      post: toObjectId(postId),
      pinnedBy: toObjectId(userId),
    };

    await Group.findByIdAndUpdate(groupId, {
      $push: { pinnedPosts: pinnedPost },
    });

    return true;
  }

  /**
   * This method does unpost pin
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} postId - Post id
   * @returns {<Promise>boolean} True if everything ok
   */
  async unpinPost(groupId = '', postId = '') {
    const pinnedPost = {
      post: toObjectId(postId),
    };

    await Group.findByIdAndUpdate(groupId, {
      $pull: { pinnedPosts: pinnedPost },
    });

    return true;
  }

  /**
   * This method checks slug exists
   *
   * @async
   * @param {string} slug - Group slug
   * @returns {<Promise>boolean} True if group with the same slug exists
   */
  async slugExists(slug = '') {
    const group = await Group.findOne({ slug }).select('_id').lean();

    return Boolean(group);
  }

  /**
   * This method connects group with another document
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} documentId - Document id
   * @param {string} field - Field
   * @returns {<Promise>boolean} True if everything ok
   */
  async connectWithDocument(groupId = '', documentId = '', field = '') {
    const group = await Group.findById(groupId).select('_id');
    group[field] = toObjectId(documentId);
    await group.save();

    return true;
  }

  /**
   * This method removes a field in document
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} field - Field
   * @returns {<Promise>boolean} True if everything ok
   */
  async removeDocumentField(groupId = '', field = '') {
    await Group.findByIdAndUpdate(groupId, { $unset: { [field]: 1 } });

    return true;
  }

  /**
   * This method gets group by id
   *
   * @async
   * @param {string} id - Group id
   * @returns {<Promise>boolean | null} Group data if it exists or null
   */
  async findById(id = '', select = '') {
    const group = await Group.findById(id).select(select).lean();

    return group;
  }

  /**
   * This method checks has group a specific field
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} field - Field
   * @returns {<Promise>string | null} Field value or null
   */
  async hasField(groupId = '', field = '') {
    const group = await Group.findById(groupId).select(field).lean();

    const hasField = group[field] ?? null;

    return hasField;
  }

  /**
   * This method adds new ban document to bans array
   *
   * @async
   * @param {string} groupId - Group id
   * @param {string} banId - Ban id
   * @returns {<Promise>boolean} True if everything ok
   */
  async addBan(groupId = '', banId = '') {
    await Group.findByIdAndUpdate(groupId, {
      $push: { bans: toObjectId(banId) },
    }).lean();

    return true;
  }
}

module.exports = new GroupService();
