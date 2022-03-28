const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  rating: {
    type: Schema.Types.ObjectId,
    ref: 'Rating',
  },
  body: {
    blocks: {
      type: Array,
      required: true,
    },
    HTML: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Comment', CommentSchema);
