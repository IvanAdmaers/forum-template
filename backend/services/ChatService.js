const ChatModel = require('../models/ChatModel');

const UserService = require('./UserService');
const MessageService = require('./MessageService');

const { toObjectId } = require('../utills');

class ChatService {
  /**
   * This method creates a new chat
   *
   * @async
   * @param {string} type - Chat type
   * @param {Array} [members = []] - Chat members
   * @param {Array} [messages = []] - Chat messages
   * @returns {<Promise>string} Created chat id
   */
  async create(type, members = [], messages = []) {
    const data = {
      type,
      members,
      messages,
    };

    const newChat = new ChatModel(data);

    const chat = await newChat.save();

    const chatId = chat._id.toString();

    return chatId;
  }

  /**
   * This method adds a message to the chat
   *
   * @async
   * @param {string} chatId - Chat id
   * @param {string} messageId - Message id to add
   * @returns {<Promise>boolean} True if everything ok
   */
  async addMessage(chatId, messageId) {
    await ChatModel.findByIdAndUpdate(chatId, {
      $push: { messages: toObjectId(messageId) },
    });

    return true;
  }

  /**
   * This method adds a member to the chat
   *
   * @async
   * @param {string} chatId - Chat id
   * @param {array} memberId - Member id to add
   * @returns {<Promise>boolean} True if everything ok
   */
  async addMember(chatId, memberId) {
    await ChatModel.findByIdAndUpdate(chatId, {
      $push: { members: toObjectId(memberId) },
    });

    return true;
  }

  /**
   * This method checks does the chat exists
   *
   * @async
   * @param {string} chatId - Chat id
   * @returns {<Promise>boolean} True if chat exists
   */
  async exists(chatId) {
    const doesExist = await ChatModel.findById(chatId).select('_id').lean();

    return Boolean(doesExist);
  }

  async getMessagesCount(chatId = '') {
    const { messages } = await ChatModel.findById(chatId)
      .select('messages')
      .lean();

    const count = messages.length;

    return count;
  }

  /**
   * This method gets chat messages
   *
   * @async
   * @param {string} chatId - Chat id
   * @param {number} limit - Messages limit
   * @returns {<Promise>Array} Array of messages
   */
  async getMessages(chatId = '', skip = 0, limit = 50) {
    const { messages } = await ChatModel.findById(chatId)
      .select('messages')
      .populate({
        path: 'messages',
        options: {
          sort: { createdAt: 1 },
          limit,
          skip,
        },
        populate: [
          {
            path: 'author',
          },
          {
            path: 'replyTo',
            populate: 'author',
          },
        ],
      })
      .lean();

    return messages;
  }

  /**
   * This method checks does a message exist in a chat
   *
   * @async
   * @param {string} chatId - Chat id
   * @param {string} messageId - Message id
   * @returns {<Promise>boolean} True if exists
   */
  async messageExists(chatId = '', messageId = '') {
    const { messages } = await ChatModel.findById(chatId)
      .select('messages')
      .lean();

    const exists = messages.some((item) => item._id.toString() === messageId);

    return exists;
  }

  /**
   * This method finds a chat by its members
   *
   * @async
   * @param {Array<string>} members - Chat members
   * @returns {<Promise>string | null} Chat id or null
   */
  async findChatByMembers(members = []) {
    const chatMembers = members.map((member) => toObjectId(member));

    const chat = await ChatModel.findOne({
      members: { $in: chatMembers },
    })
      .select('_id')
      .lean();

    const result = chat ? chat._id.toString() : null;

    return result;
  }

  /**
   * This method gets a chat information
   *
   * @async
   * @param {string} chatId - Chat id
   * @param {string} userId - User id
   * @returns {<Promise>Object} Chat information
   */
  async getInfo(chatId = '', userId = '') {
    const { messages, members } = await ChatModel.findById(chatId)
      .select('messages members')
      .populate({
        path: 'messages',
        select: 'author message read createdAt',
        populate: {
          path: 'author',
          select: 'username image verification',
        },
      })
      .lean();

    const [interlocutorId] = members.filter(
      (memberId) => memberId.toString() !== userId
    );

    const interlocutor = await UserService.findById(interlocutorId);

    const hasUnreadMessages = messages.some(
      ({ author, read }) => author._id.toString() !== userId && !read
    );
    const lastMessage = messages[messages.length - 1];

    return { hasUnreadMessages, lastMessage, interlocutor };
  }

  /**
   * This method marks a chay as read
   *
   * @async
   * @param {string} chatId - Chat id
   * @param {string} userId - User id
   * @returns {<Promise>boolean} True if everything is ok
   */
  async markAsRead(chatId = '', userId = '') {
    // Get messages of a interlocutor
    const { messages } = await ChatModel.findById(chatId)
      .select('messages')
      .populate({
        path: 'messages',
        match: { author: { $ne: toObjectId(userId) }, read: false },
        select: '_id',
      });

    const promises = [];

    messages.forEach((messageId) => {
      promises.push(MessageService.markAsRead(messageId));
    });

    await Promise.all(promises);

    return true;
  }

  /**
   * This method gets a global chat id
   *
   * @async
   * @returns {<Promise>string | null} Global chat id or null
   */
  async getGlobalChatId() {
    const globalChat = await ChatModel.findOne({ type: 'global' });

    if (!globalChat) {
      return null;
    }

    const id = globalChat._id.toString();

    return id;
  }
}

module.exports = new ChatService();
