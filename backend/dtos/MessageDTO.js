const AuthorDTO = require('./AuthorDto');

class MessageDTO {
  constructor(message, author) {
    const { _id, message: messageText, createdAt, replyTo } = message;

    this.id = _id;
    this.message = messageText;
    this.createdAt = createdAt;
    this.author = new AuthorDTO(author);

    if (replyTo && replyTo.message) {
      this.replyTo = new MessageDTO(replyTo, replyTo.author);
    }
  }
}

module.exports = MessageDTO;
