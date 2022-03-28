const Rating = require('../models/RatingModel');
const UserService = require('./UserService');

const { toObjectId } = require('../utills');

class RatingService {
  /**
   * This method creates rating document
   *
   * @async
   * @param {object} options - Options object
   * @returns {<Promise>string} Rating document id
   */
  async create(options = {}) {
    // By default author upvoted own post or comment
    const { postId, commentId, authorId } = options;
    if (!postId && !commentId) throw new Error('Some params are empty');

    const newRating = new Rating({});

    // Type
    const field = !postId ? 'comment' : 'post';
    const value = !postId ? commentId : postId;

    newRating[field] = toObjectId(value);

    // Rating
    const rating = authorId ? 1 : 0;

    newRating.rating = rating;

    // Voted
    newRating.voted = [{ user: toObjectId(authorId), vote: rating }];

    // Save
    const { _id } = await newRating.save();

    return _id.toString();
  }

  /**
   * This method rates post / comment
   *
   * @async
   * @param {string} type - Ref type
   * @param {string} documentId - Document id
   * @param {string} documentAuthorId - Document author id
   * @param {number} vote - Vote. 0, 1, -1
   * @param {string} userId - User id
   * @returns {<Promise>Object} Error text if error or null
   */
  async vote(
    type = '',
    documentId = '',
    documentAuthorId = '',
    vote = 0,
    userId = ''
  ) {
    const types = ['post', 'comment'];

    if (!types.includes(type)) throw new Error('Type is incorrect');

    // Find rating
    const ratingDocument = await Rating.findOne({ [type]: documentId }).select(
      'rating voted'
    );

    const { voted, rating } = ratingDocument;

    const newVote = { user: toObjectId(userId), vote };

    // 1. Get previous vote
    const prevVote = voted.find(({ user }) => user.toString() === userId);

    // 2. Check
    if (prevVote?.vote === vote) return { error: 'Repeat action' };

    // 3. New rating value
    const newRating = this._getRatingValue(vote, prevVote?.vote);
    const newRatingValue = rating + newRating;

    ratingDocument.rating = newRatingValue;

    // 4. Set new vote
    if (!prevVote) {
      ratingDocument.voted.push(newVote);
    }

    if (prevVote) {
      prevVote.vote = vote;
    }

    // Update user karma
    if (documentAuthorId !== userId) {
      await UserService.updateKarma(newRating, documentAuthorId);
    }

    await ratingDocument.save();

    return { error: null };
  }

  /**
   * This method checks should we change vote
   *
   * @param {Array} voted - Voted array
   * @param {number} vote - Vote
   * @param {string} userId - User id
   * @returns {object} Object with error field
   */
  _voteChecks(voted = [], vote = 0, userId = '') {
    switch (vote) {
      // Case - upvote
      case 1: {
        const some = voted.some(
          ({ user, vote: prevVote }) =>
            user.toString() === userId && prevVote === 1
        );

        if (some) return { error: 'You have already upvoted the post' };

        return { error: null };
      }

      // Case - downvote
      case -1: {
        const some = voted.some(
          ({ user, vote: prevVote }) =>
            user.toString() === userId && prevVote === -1
        );

        if (some) return { error: 'You have already downvoted this post' };

        return { error: null };
      }

      // Case - cancel vote
      case 0: {
        const prevVote = voted.find(({ user }) => user.toString() === userId);

        if (!prevVote) return { error: 'You haven not rated this post yet' };

        return { error: null };
      }

      default:
        return { error: 'Somehting wrong' };
    }
  }

  /**
   * This method gets new rating value
   *
   * @param {number} rating - Rating
   * @param {number} vote - Current vote
   * @param {number | null} prevVote - Previous vote
   * @returns {number} New rating value
   */
  // _getNewRatingValue(rating = 0, vote = 0, prevVote) {
  //   switch (vote) {
  //     case 1:
  //       return prevVote === -1 ? rating + 2 : rating + 1;

  //     case -1:
  //       return prevVote === 1 ? rating - 2 : rating - 1;

  //     case 0:
  //       return prevVote === 1 ? rating - 1 : rating + 1;

  //     default:
  //       throw new Error('Vote value is unknown');
  //   }
  // }

  /**
   * This method gets new rating value
   *
   * @param {number} vote - Current vote
   * @param {number | null} prevVote - Previous vote
   * @returns {number} New rating value
   */
  _getRatingValue(vote = 0, prevVote) {
    switch (vote) {
      case 1:
        return prevVote === -1 ? 2 : 1;

      case 0:
        return prevVote === 1 ? -1 : 1;

      case -1:
        return prevVote === 1 ? -2 : -1;

      default:
        throw new Error('Vote value is unknown');
    }
  }
}

module.exports = new RatingService();
