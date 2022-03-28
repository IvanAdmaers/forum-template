const { Schema, model } = require('mongoose');

function isImageParamRequired() {
  return this.previewImage && this.previewImage.url;
}

const PostSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slug: {
    type: String,
    required: true,
    uniq: true,
  },
  title: {
    type: String,
    required: true,
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
  previewImage: {
    url: {
      type: String,
    },
    width: {
      type: Number,
      required: isImageParamRequired.bind(this),
    },
    height: {
      type: Number,
      required: isImageParamRequired.bind(this),
    },
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isNSFW: {
    type: Boolean,
    required: true,
  },
  isOriginalContent: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Schema.Types.ObjectId,
    ref: 'Rating',
  },
  editedAt: {
    type: Date,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

module.exports = model('Post', PostSchema);
