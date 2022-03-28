const { Schema, model } = require('mongoose');

const ChatSchema = new Schema({
  /*
    Available types:
      * global - global chat
      * public - for group chats
      * private - between some users
  */
  type: {
    type: String,
    required: true,
  },
  /*
    Chat members if type is private
  */
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: function isRequired() {
        return this.type === 'private';
      },
    },
  ],
  /*
    Chat messages
  */
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  /*
    Chat created at date
  */
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Chat', ChatSchema);
