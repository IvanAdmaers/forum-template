const Verification = require('../models/VerificationModel');

const UserService = require('./UserService');
const GroupService = require('./GroupService');

const { toObjectId } = require('../utills');

class VerificationService {
  constructor() {
    this._verificationField = 'verification';
  }

  /**
   * This method adds verification to user
   *
   * @private
   * @async
   * @param {string} userId - User id
   * @param {string} verificationBy - Verification by user id
   * @param {string} message - Optional verification message
   * @returns {<Promise>boolean} True if everything ok
   */
  // async _addToUser(userId = '', verificationBy = '', message = '') {
  //   const newVerification = new Verification({
  //     user: toObjectId(userId),
  //     verificationBy: toObjectId(verificationBy),
  //   });

  //   if (message) {
  //     newVerification.message = message;
  //   }

  //   const { _id } = await newVerification.save();

  //   await UserService.connectWithDocument(userId, _id, this._verificationField);

  //   return true;
  // }

  /**
   * This method does user or group verification
   *
   * @async
   * @param {string} type - User or group
   * @param {string} id - User id or group id
   * @param {string} verificationBy - Verified by user id
   * @param {string} message - Optional message
   * @returns {<Promise>boolean} True if everything ok
   */
  async add(type = '', id = '', verificationBy = '', message = '') {
    const newVerification = new Verification({
      [type]: toObjectId(id),
      verificationBy: toObjectId(verificationBy),
    });

    if (message) {
      newVerification.message = message;
    }

    const verificationDocument = await newVerification.save();

    const verificationId = verificationDocument._id.toString();

    const Service = type === 'user' ? UserService : GroupService;

    await Service.connectWithDocument(
      id,
      verificationId,
      this._verificationField
    );

    return true;
  }

  /**
   * This method removes user pr group verification
   *
   * @async
   * @param {string} type - User or group
   * @param {string} id - User id or group id
   * @returns {<Promise>boolean} True if everything ok
   */
  async remove(type = '', id = '') {
    await Verification.findOneAndRemove({
      $or: [{ user: toObjectId(id) }, { group: toObjectId(id) }],
    });

    const Service = type === 'user' ? UserService : GroupService;

    await Service.removeDocumentField(id, this._verificationField);

    return true;
  }

  /**
   * This method checks has the user or group verification
   *
   * @async
   * @param {string} type - User or group
   * @param {string} id - User id or group id
   * @returns {<Promise>boolean} True if has verification
   */
  async hasVerification(type = '', id = '') {
    const verification = await Verification.findOne({ [type]: toObjectId(id) })
      .select('_id')
      .lean();

    return Boolean(verification);
  }
}

module.exports = new VerificationService();
