const { Schema, model } = require('mongoose');

const TokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshTokens: {
    type: Array,
    required: true,
  },
  lastCleaning: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Token', TokenSchema);
