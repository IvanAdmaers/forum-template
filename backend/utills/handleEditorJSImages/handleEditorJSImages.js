const { URL } = require('url');
const getBufferByUrl = require('../getBufferByUrl');
const getImageBufferData = require('../getImageBufferData');

const {
  POST_PREVIEW_IMAGE_WIDTH,
  POST_PREVIEW_IMAGE_HEIGHT,
} = require('../../constants/post');

const copyObj = (obj = {}) => JSON.parse(JSON.stringify(obj));

const handleImage = async (block = {}) => {
  const emptyImage = {
    id: block.id,
    data: null,
  };

  try {
    const currentBlock = copyObj(block);

    const { url } = currentBlock.data.file;

    const imageBuffer = await getBufferByUrl(url);

    if (!imageBuffer) return emptyImage;

    const [width, height] = await getImageBufferData(imageBuffer);

    const imageUrl = new URL(url);

    imageUrl.searchParams.append(POST_PREVIEW_IMAGE_WIDTH, width);
    imageUrl.searchParams.append(POST_PREVIEW_IMAGE_HEIGHT, height);

    currentBlock.data.file = {
      ...currentBlock.data.file,
      url: imageUrl.href,
      width,
      height,
    };

    return currentBlock;
  } catch (e) {
    return emptyImage;
  }
};

const getPreview = (imagesBlocks = []) => {
  for (let i = 0; i < imagesBlocks.length; i += 1) {
    const imageBlock = imagesBlocks[i]?.data?.file;
    const url = imageBlock?.url;
    const width = imageBlock?.width;
    const height = imageBlock?.height;

    if (url && width && height)
      return {
        url,
        width,
        height,
      };
  }

  return null;
};

/**
 * This function handles Editor JS images
 *
 * @async
 * @param {array} blocks - Editor JS blocks
 * @returns {<Promise>array} Handled blocks and preview image
 */
const handleEditorJSImages = async (blocks = []) => {
  const promises = [];

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];

    const { type } = block;

    // eslint-disable-next-line no-continue
    if (type !== 'image') continue;

    promises.push(handleImage(block));
  }

  const imagesBlocks = await Promise.all(promises);

  const handledBlocks = blocks.map((block) => {
    const { id } = block;

    const imageBlock = imagesBlocks.find((imgBlock) => imgBlock?.id === id);

    if (imageBlock?.data === null) return null;

    if (imageBlock?.data) return imageBlock;

    return block;
  });

  const filteredBlocks = handledBlocks.filter((block) => Boolean(block));

  const previewImage = getPreview(imagesBlocks);

  return [filteredBlocks, previewImage];
};

module.exports = handleEditorJSImages;
