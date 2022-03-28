const { Schema, model } = require('mongoose');

const ComplaintSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: function isRequired() {
      return !this.comment;
    },
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: function isRequired() {
      return !this.post;
    },
  },
  reason: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Complaint', ComplaintSchema);
