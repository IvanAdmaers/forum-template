const Ban = require('../models/BanModel');

const UserService = require('./UserService');
const GroupService = require('./GroupService');
const TokenService = require('./TokenService');

const { toObjectId, addMinutesToDate } = require('../utills');

class BanService {
  constructor() {
    this._fieldName = 'bans';
  }

  /**
   * This method bans users
   *
   * @async
   * @param {string} type - User or group
   * @param {string} documentId - User id or group id to ban
   * @param {number | null} duration - Ban duration in minutes or null if eternal ban
   * @param {string} bannedByUserId - Banned by user id
   * @param {string} reason - Ban reason
   * @param {string} insideComment - Ban inside comment
   * @returns {<Promise>boolean} True if everything ok
   */
  async toBan(
    type = '',
    documentId = '',
    duration = 0,
    bannedByUserId = '',
    reason = '',
    insideComment = ''
  ) {
    const Service = type === 'user' ? UserService : GroupService;

    // Check has [user or group] ban field
    const banDocument = await Service.hasField(documentId, this._fieldName);

    // If [user or group] already has a ban set it expired status to true
    if (banDocument.length) {
      const banDocumentId = banDocument[banDocument.length - 1].toString();

      await this._changeBanStatus(banDocumentId, true);
    }

    // To ban
    const newBan = new Ban({
      [type]: toObjectId(documentId),
      bannedBy: toObjectId(bannedByUserId),
      reason,
    });

    if (duration) newBan.duration = duration;
    if (insideComment) newBan.insideComment = insideComment;

    const { _id } = await newBan.save();

    const newBanId = _id.toString();

    // Remove all refresh tokens
    if (type === 'user') {
      await TokenService.deleteAllRefreshTokens(documentId);
    }

    await Service.addBan(documentId, newBanId);

    return true;
  }

  /**
   * This method changes ban status
   *
   * @async
   * @private
   * @param {string} documentId - Document id
   * @param {boolean} expired - Expired status
   * @returns {<Promise>boolean} True if status were changed
   */
  async _changeBanStatus(documentId = '', expired = false) {
    await Ban.findByIdAndUpdate(documentId, { expired });

    return true;
  }

  /**
   * This method gets ban info
   *
   * @async
   * @param {string} documentId - Document id
   * @returns {<Promise>Object} { status: boolean, message: string | null }
   */
  async getInfo(documentId = '') {
    const result = { status: false, message: null };

    const ban = await Ban.findById(documentId)
      .select('expired reason duration bannedAt')
      .lean();

    if (!ban) {
      return result;
    }

    if (!ban.duration) {
      result.status = true;
      result.message = ban.reason;

      return result;
    }

    const banExpiredTime = addMinutesToDate(ban.bannedAt, ban.duration);

    if (new Date() > banExpiredTime) {
      await this._changeBanStatus(documentId, true);

      return result;
    }

    result.status = true;
    result.message = ban.reason;

    return result;
  }
}

module.exports = new BanService();
