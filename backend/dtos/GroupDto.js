const { userVerification } = require('./utills');

class GroupDto {
  constructor(model) {
    this.id = model._id;
    this.title = model.title;
    this.image = model.image;
    this.slug = model.slug;
    this.description = model.description;
    this.tags = model.tags;
    this.isNSFW = model.isNSFW;
    this.createdAt = model.createdAt;
    this.membersCount = model.membersCount;
    this.verification = userVerification(model.verification);
    this.ban = model.ban;
  }
}

module.exports = GroupDto;
