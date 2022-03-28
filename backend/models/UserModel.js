const { Schema, model } = require('mongoose');
const { USER_DEFAULT_ROLE } = require('../constants/user');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    // unique: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  roles: {
    type: Array,
    default: [USER_DEFAULT_ROLE],
  },
  image: {
    type: String,
    required: true,
  },
  tokens: {
    type: Schema.Types.ObjectId,
    ref: 'Token',
  },
  confirmationCodes: {
    type: Schema.Types.ObjectId,
    ref: 'ConfirmationCode',
  },
  logs: {
    type: Schema.Types.ObjectId,
    ref: 'Log',
  },
  bans: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ban',
    },
  ],
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  karma: {
    type: Number,
    default: 0,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  verification: {
    type: Schema.Types.ObjectId,
    ref: 'Verification',
  },
  chats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
  ],
});

module.exports = model('User', UserSchema);
