const { userVerification } = require('./utills');

const { addParamsToUrl } = require('../utills');

class AuthorDto {
  constructor(model) {
    const { _id, username, image } = model;

    this.id = _id;
    this.username = username;
    this.image = addParamsToUrl(image, 'd', 'retro');
    this.verification = userVerification(model.verification);
  }
}

module.exports = AuthorDto;
