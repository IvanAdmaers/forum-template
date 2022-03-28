const PremiumUsername = require('../models/PremiumUsername');

const { toObjectId } = require('../utills');

class PremiumUsernameService {
  /**
   * This method adds a new premium username
   *
   * @async
   * @param {string} username - Username
   * @param {number} price - Price in USD
   * @param {number} discountPrice - Discount price in USD (optional)
   * @param {boolean} available - Is available
   * @param {string} addedByUserId - Added by user id
   * @returns {<Promise>object} Created document
   */
  async add(
    username = '',
    price = 0,
    discountPrice = 0,
    available = true,
    addedByUserId = ''
  ) {
    const data = {
      username,
      price,
      addedBy: toObjectId(addedByUserId),
      available,
    };

    if (discountPrice) {
      data.discountPrice = discountPrice;
    }

    const premiumUsername = new PremiumUsername(data);

    const newPremiumUsername = await premiumUsername.save();

    return newPremiumUsername;
  }

  /**
   * This method checks does premium username exists
   *
   * @async
   * @param {string} type - Username or id
   * @param {string} username - Premium username
   * @returns {<Promise>boolean} True if username exists
   */
  async exists(type = '', value = '') {
    const searchParam = type === 'id' ? '_id' : 'username';
    const searchValue =
      type === 'id' ? toObjectId(value) : new RegExp(`^${value}$`, 'i');

    const document = await PremiumUsername.findOne({
      [searchParam]: [searchValue],
    })
      .select('_id')
      .lean();

    return Boolean(document);
  }

  /**
   * This method edits username data
   *
   * @async
   * @param {string} id - Document id
   * @param {number} price - Price
   * @param {number} discountPrice - Discount price
   * @param {boolean} available - Is available
   * @returns {<Promise>object} Edited username
   */
  async edit(id = '', price = 0, discountPrice = 0, available = true) {
    const data = { price, available };

    if (discountPrice) data.discountPrice = discountPrice;

    const unset = { $unset: {} };

    if (!discountPrice) unset.$unset.discountPrice = 1;

    const editedUsername = await PremiumUsername.findByIdAndUpdate(
      id,
      { ...data, ...unset },
      {
        new: true,
      }
    );

    return editedUsername;
  }

  /**
   * This method gets total count of premium usernames
   *
   * @async
   * @returns {<Promise>number} Total count of documents
   */
  async getTotalCount() {
    const totalCount = await PremiumUsername.countDocuments();

    return totalCount;
  }

  /**
   * This method gets premium usernames list
   *
   * @async
   * @param {number} limit - Limit
   * @param {number} startIndex - Start index
   * @returns {<Promise>Array} Array of posts
   */
  async getList(limit = 10, startIndex = 0) {
    const list = await PremiumUsername.find()
      .limit(limit)
      .skip(startIndex)
      .sort({ addedAt: -1 })
      .lean();

    return list;
  }
}

module.exports = new PremiumUsernameService();
