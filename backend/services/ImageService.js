const fetch = require('node-fetch');
const FormData = require('form-data');

class ImageService {
  constructor() {
    this._allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp'];
    this._maxSize = 30 * (1024 * 1024); // size in bytes
  }

  /**
   * This method checks is image available for upload
   *
   * @param {object} image - Express file uploader image
   * @param {number=} maxSize - Max image size in bytes (optional)
   * @returns {object} - Object with error property
   */
  isAvailableForUpload(image = {}, maxSize) {
    const { mimetype, size } = image;

    // Check image type
    const type = mimetype.split('/').pop();

    if (!this._allowedTypes.includes(type)) {
      return { error: 'File type not supported' };
    }

    if ((maxSize !== undefined && size > maxSize) || size > this._maxSize) {
      return { error: 'File size too large' };
    }

    return { error: null };
  }

  /**
   * This method uploads image to server
   *
   * @param {object} image - Image data fron express fileuploader
   * @returns {object} - Object with url field or with error field
   */
  async upload(image = {}) {
    const { mimetype, name, data } = image;

    const secretKey = process.env.IMG_BB_API_KEY;

    const formData = new FormData();

    formData.append('image', data, {
      contentType: mimetype,
      name: 'image',
      filename: name,
    });

    const imageName = name.split('.')[0];

    formData.append('name', imageName);

    formData.append('key', secretKey);

    const req = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await req.json();

    if (res.error) {
      return { error: res.error };
    }

    return { url: res.data.url };
  }
}

module.exports = new ImageService();
