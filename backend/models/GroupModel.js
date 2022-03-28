const { Schema, model } = require('mongoose');

const GroupSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    uniq: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  description: {
    type: String,
  },
  isNSFW: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  membersCount: {
    type: Number,
    default: 0,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  pinnedPosts: [
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
      pinnedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      pinnedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  // for future changes
  roles: {
    type: Array,
    default: [],
  },
  verification: {
    type: Schema.Types.ObjectId,
    ref: 'Verification',
  },
  bans: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ban',
    },
  ],
});

module.exports = model('Group', GroupSchema);
