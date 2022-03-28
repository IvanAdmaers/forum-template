const { isJWTTokenValid } = require('../../../../utills');

const filterTokens = (tokens = []) => {
  const freshTokens = tokens.filter((token) => isJWTTokenValid(token));

  return freshTokens;
};

module.exports = filterTokens;
