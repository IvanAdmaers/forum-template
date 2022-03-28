class RatingDto {
  constructor(model, userId) {
    const { rating, voted } = model;

    this.rating = rating;
    this.userVote = this._getUserVote(voted, userId);
  }

  _getUserVote(voted, userId) {
    if (!userId) return 0;

    const userVote = voted.find(({ user }) => user.toString() === userId);

    if (!userVote) return 0;

    return userVote.vote;
  }
}

module.exports = RatingDto;
