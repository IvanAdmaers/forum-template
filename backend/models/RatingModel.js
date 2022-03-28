const { Schema, model } = require('mongoose');

const RatingSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  },
  rating: {
    type: Number,
    default: 0,
  },
  voted: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      vote: {
        type: Number,
        required: true,
      },
      votedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = model('Rating', RatingSchema);
