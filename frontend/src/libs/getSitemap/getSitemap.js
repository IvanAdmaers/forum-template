const fs = require('fs/promises');
const path = require('path');

const { getSitemap: getSitemapAPI } = require('api');

/**
 * This function gets sitemap.xml and move it to public folder
 */
const getSitemap = async () => {
  try {
    const sitemap = await getSitemapAPI();

    await fs.writeFile(path.resolve('./public/sitemap.xml'), sitemap);

    return true;
  } catch (error) {
    console.log(error);
  }
};

module.exports = getSitemap;
