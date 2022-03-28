const ChatService = require('../services/ChatService');
const UserService = require('../services/UserService');

const MessageDTO = require('../dtos/MessageDTO');
const AuthorDTO = require('../dtos/AuthorDto');

exports.create = async (req, res, next) => {
  try {
    const { type } = req.body.chat;

    const chatId = await ChatService.create(type);

    return res.status(201).json({ chat: { id: chatId } });
  } catch (e) {
    return next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { id: chatId } = req.params;

    const messages = await ChatService.getMessages(chatId);

    const messagesList = messages.map(
      (message) => new MessageDTO(message, message.author)
    );

    return res.json({ messages: messagesList });
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const chatList = await UserService.getChats(userId);

    const promises = [];

    chatList.forEach((chat) =>
      promises.push(ChatService.getInfo(chat, userId))
    );

    const chatInfo = await Promise.all(promises);
    const chatInfoModified = chatInfo.map((chat) => ({
      ...chat,
      lastMessage: new MessageDTO(chat.lastMessage, chat.lastMessage.author),
      interlocutor: new AuthorDTO(chat.interlocutor),
    }));

    const chats = chatList.map((id, index) => ({
      id,
      info: chatInfoModified[index],
    }));

    return res.json({ chats });
  } catch (e) {
    return next(e);
  }
};
