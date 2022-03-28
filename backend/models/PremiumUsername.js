const { Schema, model } = require('mongoose');

const PremiumUsernameSchema = new Schema({
  username: {
    type: String,
    uniq: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  available: {
    type: Boolean,
    default: true,
  },
  boughtBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boughtAt: {
    type: Date,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('PremiumUsername', PremiumUsernameSchema);
