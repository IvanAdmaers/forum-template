const PremiumUsernameService = require('../services/PremiumUsernameService');

const PremiumUsernameDTO = require('../dtos/PremiumUsernameDTO');

const { getPaginationData } = require('../utills');

exports.add = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, price, discountPrice, available } =
      req.body.premiumUsername;

    const premiumUsernameData = await PremiumUsernameService.add(
      username,
      price,
      discountPrice,
      available,
      userId
    );

    const premiumUsername = new PremiumUsernameDTO(premiumUsernameData);

    return res.json({ premiumUsername });
  } catch (e) {
    return next(e);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { id, price, discountPrice, available } = req.body.premiumUsername;

    const editedPremiumUsername = await PremiumUsernameService.edit(
      id,
      price,
      discountPrice,
      available
    );

    const premiumUsernameDTO = new PremiumUsernameDTO(editedPremiumUsername);

    return res.json({ premiumUsername: premiumUsernameDTO });
  } catch (e) {
    return next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const { page: pageQuery, limit: limitQuery } = req.query;

    const totalCount = await PremiumUsernameService.getTotalCount();

    const { page, limit, startIndex, numberOfPages } = getPaginationData(
      pageQuery,
      limitQuery,
      totalCount
    );

    const premiumUsernames = await PremiumUsernameService.getList(
      limit,
      startIndex
    );

    const premiumUsernamesList = premiumUsernames.map(
      (item) => new PremiumUsernameDTO(item)
    );

    return res.json({
      currentPage: page,
      numberOfPages,
      premiumUsernames: premiumUsernamesList,
    });
  } catch (e) {
    return next(e);
  }
};
