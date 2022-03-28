const { Schema, model } = require('mongoose');

const RiskSchema = new Schema({
  ip: {
    type: String,
    required: true,
    uniq: true,
  },
  authAttempts: [
    {
      userAgent: String,
      date: { type: Date, default: Date.now },
    },
  ],
  registerAttempts: [
    {
      userAgent: String,
      date: { type: Date, default: Date.now },
    },
  ],
  resetPasswordAttempts: [
    {
      userAgent: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

module.exports = model('Risk', RiskSchema);
