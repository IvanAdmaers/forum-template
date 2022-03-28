const Log = require('../models/LogModel');
const UserService = require('./UserService');

const { toObjectId } = require('../utills');

class LogService {
  /**
   * This method logs action
   *
   * @async
   * @param {string} userId - User id
   * @param {string} type - Action type
   * @param {string} ip - User ip
   * @param {string} userAgent - User user-agent
   * @returns {Promise<boolean>} True if everything good
   */
  async action(userId = '', type = '', ip = '', userAgent = '') {
    const document = await Log.findOne({ user: toObjectId(userId) });

    const action = { type, ip, userAgent };

    // New document
    if (!document) {
      const newAction = new Log({
        user: toObjectId(userId),
        logs: [action],
      });

      const { _id } = await newAction.save();

      await UserService.connectWithDocument(userId, _id, 'logs');

      return true;
    }

    // Document already exists
    document.logs.push(action);

    await document.save();

    return true;
  }
}

module.exports = new LogService();
