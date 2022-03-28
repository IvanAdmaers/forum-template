class PostDto {
  constructor(model) {
    const {
      _id,
      title,
      slug,
      body,
      isNSFW,
      isOriginalContent,
      createdAt,
      commentsCount,
      pinned,
    } = model;

    this.id = _id;
    this.title = title;
    this.slug = slug;
    this.body = body;
    this.isNSFW = isNSFW;
    this.isOriginalContent = isOriginalContent;
    this.createdAt = createdAt;
    this.previewImage = this._getPostPreviewImage(model);
    this.pinned = Boolean(pinned);
    this.commentsCount = commentsCount;
  }

  _getPostPreviewImage(model) {
    return Object.prototype.hasOwnProperty.call(model, 'previewImage')
      ? model.previewImage
      : null;
  }
}

module.exports = PostDto;
