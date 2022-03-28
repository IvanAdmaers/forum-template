const BanService = require('../../../services/BanService');

const getBanInfo = async (banDocumentId) => {
  try {
    const result = { status: false };

    if (!banDocumentId) return result;

    const { status, message } = await BanService.getInfo(banDocumentId);

    result.status = status;
    if (message) result.message = message;

    return result;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
};

module.exports = getBanInfo;
