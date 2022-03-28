const { Schema, model } = require('mongoose');

const ConfirmationCodesSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  emailConfirmations: [
    {
      code: { type: String },
      type: { type: String },
      isConfirmed: { type: Boolean },
      confirmedAt: { type: Date },
      date: { type: Date },
      lastMailRequest: { type: Date },
    },
  ],
  resetPasswordConfirmations: [
    {
      code: { type: String },
      type: { type: String },
      isConfirmed: { type: Boolean },
      confirmedAt: { type: Date },
      date: { type: Date },
      lastMailRequest: { type: Date },
    },
  ],
});

module.exports = model('ConfirmationCode', ConfirmationCodesSchema);
