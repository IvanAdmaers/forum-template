const MessageModel = require('../models/MessageModel');

const { toObjectId } = require('../utills');

class MessageService {
  /**
   * This method creates a new message
   *
   * @param {string} authorId - Author id
   * @param {string} message - Message
   * @param {string} [replyToId] - Reply to
   * @returns {<Promise>Object} - Created message
   */
  async create(authorId = '', message = '', replyToId = '') {
    const newMessage = new MessageModel({
      author: toObjectId(authorId),
      message,
    });

    if (replyToId) {
      newMessage.replyTo = toObjectId(replyToId);
    }

    const createdMessage = await newMessage.save();

    const promises = [];

    promises.push(createdMessage.populate('author').execPopulate());

    if (replyToId) {
      promises.push(
        createdMessage
          .populate({ path: 'replyTo', populate: 'author' })
          .execPopulate()
      );
    }

    await Promise.all(promises);

    return createdMessage;
  }

  /**
   * This method sets the message deleted param to true
   *
   * @async
   * @param {string} messageId - Message id
   * @returns {<Promise>boolean} True if everything ok
   */
  async setAsDeleted(messageId = '') {
    await MessageModel.findByIdAndUpdate(messageId, { isDeleted: true });

    return true;
  }

  /**
   * This method sets a message as read
   *
   * @async
   * @param {string} messageId - Message id
   * @returns {<Promise>boolean} True if everything ok
   */
  async markAsRead(messageId = '') {
    await MessageModel.findByIdAndUpdate(messageId, { read: true });

    return true;
  }
}

module.exports = new MessageService();
