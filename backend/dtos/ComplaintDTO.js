const PostDTO = require('./PostDto');
const CommentDTO = require('./CommentDto');

class ComplaintDTO {
  constructor(model, userId) {
    const { _id, post, comment } = model;

    this.id = _id;

    if (post) {
      this.post = new PostDTO(post);
    }

    if (comment) {
      this.comment = new CommentDTO(comment, userId);
    }
  }
}

module.exports = ComplaintDTO;
