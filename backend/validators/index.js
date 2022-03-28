const usernameValidator = require('./usernaveValidator');
const emailValidator = require('./emailValidator');
const passwordValidator = require('./passwordValidator');
const emailConfirmationValidator = require('./emailConfirmationValidator');
const createGroupValidator = require('./createGroupValidator');
const postValidator = require('./postValidator');
const commentValidator = require('./commentValidator');
const groupUrlValidator = require('./groupUrlValidator');
const searchValidator = require('./searchValidator');
const verificationValidator = require('./verificationValidator');
const banValidator = require('./banValidator');
const premiumUsernameValidator = require('./premiumUsername/premiumUsernameValidator');
const editPremiumUsernameValidator = require('./premiumUsername/editPremiumUsernameValidator');
const chatValidator = require('./chatValidator');
const getChatMessagesValidator = require('./getChatMessagesValidator');
const requestSocketConnectionValidator = require('./requestSocketConnectionValidator');
const captchaTokenValidator = require('./captchaTokenValidator');
const complaintValidator = require('./complaintValidator');
const complaintDecisionValidator = require('./complaintDecisionValidator');

module.exports = {
  usernameValidator,
  emailValidator,
  passwordValidator,
  emailConfirmationValidator,
  createGroupValidator,
  postValidator,
  commentValidator,
  groupUrlValidator,
  searchValidator,
  verificationValidator,
  banValidator,
  premiumUsernameValidator,
  editPremiumUsernameValidator,
  chatValidator,
  getChatMessagesValidator,
  requestSocketConnectionValidator,
  captchaTokenValidator,
  complaintValidator,
  complaintDecisionValidator,
};
