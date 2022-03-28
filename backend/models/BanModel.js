const { Schema, model } = require('mongoose');

const BanSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function isRequired() {
      return !this.group;
    },
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: function isRequired() {
      return !this.user;
    },
  },
  duration: {
    type: Number,
  },
  bannedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  expired: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    required: true,
  },
  insideComment: {
    type: String,
  },
  bannedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Ban', BanSchema);
