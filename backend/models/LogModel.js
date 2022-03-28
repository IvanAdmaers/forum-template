const { Schema, model } = require('mongoose');

const LogSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  logs: [
    {
      type: { type: String },
      ip: { type: String },
      userAgent: { type: String },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = model('Log', LogSchema);
