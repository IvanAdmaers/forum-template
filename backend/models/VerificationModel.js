const { Schema, model } = require('mongoose');

const VerificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  verificationBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
  },
  verificationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model('Verification', VerificationSchema);
