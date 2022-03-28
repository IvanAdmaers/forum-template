const { maskEmail, addParamsToUrl } = require('../utills');

const { userVerification } = require('./utills');

class UserDto {
  constructor(model, shouldIncludePrivateData = false) {
    this.id = model._id;
    this.username = model.username;
    this.image = addParamsToUrl(model.image, 'd', 'retro');
    this.createdAt = model.createdAt;
    this.verification = userVerification(model.verification);
    this.ban = model.ban;

    if (shouldIncludePrivateData) {
      this.email = maskEmail(model.email);
      this.roles = model.roles;
      this.isEmailConfirmed = this._isEmailConfirmed(model);
    }
  }

  _isEmailConfirmed(model = {}) {
    const confirmations = model.confirmationCodes?.emailConfirmations;
    const length = confirmations?.length;

    const isConfirmed = confirmations?.[length - 1]?.isConfirmed;

    return !!isConfirmed;
  }
}

module.exports = UserDto;
