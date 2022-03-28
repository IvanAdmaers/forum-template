const AuthorDto = require('./AuthorDto');
const RatingDto = require('./RadingDto');

class CommentDto {
  constructor(model, userId) {
    const { _id, body, createdAt, author, rating, children, parent } = model;

    const parentId = !parent ? null : parent.toString();

    this.comment = {
      id: _id,
      body: body.HTML,
      createdAt,
      parentId,
    };
    this.author = new AuthorDto(author);
    this.rating = new RatingDto(rating, userId);
    this.children = this._getChildren(children, userId);
  }

  _getChildren(children, userId) {
    if (!children || !children.length) {
      return null;
    }

    const childrenList = children.map((comment) => ({
      // comment: new CommentDto(comment, userId).comment,
      ...new CommentDto(comment, userId),
      author: new AuthorDto(comment.author),
      rating: new RatingDto(comment.rating, userId),
    }));

    return childrenList;
  }
}

module.exports = CommentDto;
