const isURL = require('is-url');

const ImageService = require('../services/ImageService');
const URLService = require('../services/URLService');

const { getBufferByUrl, getFileDataByBuffer } = require('../utills');

exports.upload = async (req, res, next) => {
  try {
    const image = req?.files?.image;

    if (!image) {
      return res.status(422).json({ success: 0, error: 'Image is undefined' });
    }

    const { error } = ImageService.isAvailableForUpload(image);

    if (error) {
      return next(res.status(422).json({ error }));
    }

    const { url } = await ImageService.upload(image);

    return res.json({ success: 1, file: { url } });
  } catch (e) {
    return next(e);
  }
};

exports.uploadByUrl = async (req, res, next) => {
  try {
    const imageUrl = req.body.image?.url;

    if (!imageUrl) {
      return res
        .status(422)
        .json({ success: 0, error: 'Image url is undefined' });
    }

    // Check is url valid
    const isValidImageURL = isURL(imageUrl);

    if (!isValidImageURL) {
      return res
        .status(422)
        .json({ success: 0, error: 'Image url is invalid' });
    }

    // Check https
    const protocol = URLService.getProtocol(imageUrl);

    if (protocol !== 'https') {
      return res
        .status(422)
        .json({ success: 0, error: 'Image url must has a https protocol' });
    }

    const imageBuffer = await getBufferByUrl(imageUrl);

    if (!imageBuffer) {
      return res
        .status(422)
        .json({ success: 0, error: 'Failed to get image buffer' });
    }

    const imageData = await getFileDataByBuffer(imageBuffer);

    if (!imageData) {
      return res
        .status(422)
        .json({ success: 0, error: 'Failed to get image data' });
    }

    const imageMime = imageData?.mime.split('/')[0];

    if (imageMime !== 'image') {
      return res
        .status(422)
        .json({ success: 0, error: 'File is not an image' });
    }

    return res.json({
      success: 1,
      file: {
        url: imageUrl,
      },
    });
  } catch (e) {
    return next(e);
  }
};
