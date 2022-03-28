const ComplaintModel = require('../models/ComplaintModel');

const { toObjectId } = require('../utills');

class ComplaintService {
  /**
   * This method add a complaint
   *
   * @async
   * @param {string} type - Complaint type [post, comment]
   * @param {string} id - Document id
   * @param {string} reason - Rason
   * @param {string} userId - User id
   * @returns {<Promise>string} Complaint id
   */
  async add(type = '', id = '', reason = '', userId = '') {
    const complaint = new ComplaintModel({
      [type]: toObjectId(id),
      reason,
      user: toObjectId(userId),
    });

    const { _id } = await complaint.save();

    const complaintId = _id.toString();

    return complaintId;
  }

  /**
   * This method checks complaint exist
   *
   * @async
   * @param {string} type - Complaint type
   * @param {string} id - Id
   * @param {string=} userId - Complaint author
   * @returns {<Promise>boolean} Exists
   */
  async exists(type = '', id = '') {
    const complaint = await ComplaintModel.findOne({ [type]: toObjectId(id) })
      .select('_id')
      .lean();

    return Boolean(complaint);
  }

  /**
   * This method gets a total count of all complaints
   *
   * @async
   * @returns {<Promise>number} Total count of all complaints
   */
  async count() {
    const count = await ComplaintModel.countDocuments();

    return count;
  }

  /**
   * This method gets complaints list
   *
   * @async
   * @param {number} limit - Limit
   * @param {number} startIndex - Start index
   * @returns {<Promise>Array} Array of posts
   */
  async list(limit = 10, startIndex = 0) {
    const list = await ComplaintModel.find()
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: 1 })
      .lean();

    const promises = [];

    list.forEach((id) => {
      promises.push(this.get(id));
    });

    const complaints = await Promise.all(promises);

    return complaints;
  }

  /**
   * This method gets a complaint info
   *
   * @async
   * @param {string} id - Complaint id
   * @returns {<Promise>Object} Complaint
   */
  async get(id = '') {
    const complaint = await ComplaintModel.findById(id).populate({
      path: 'post comment',
      populate: {
        path: 'author rating',
      },
    });

    return complaint;
  }

  /**
   * This method deletes a complaint
   *
   * @async
   * @param {string} id - Complaint id
   * @returns {<Promise>boolean} True if everything is ok
   */
  async delete(id = '') {
    const objectId = toObjectId(id);
    const status = await ComplaintModel.findByIdAndDelete(objectId);

    return status;
  }
}

module.exports = new ComplaintService();
