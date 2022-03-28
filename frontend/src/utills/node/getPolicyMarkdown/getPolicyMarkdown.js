const fs = require('fs/promises');
const path = require('path');

/**
 * This function reads policy files
 * 
 * @async
 * @param {string} file - File name with extension
 * @returns {<Promise>string} File data
 */
const getPolicyMarkdown = async (file = '') => {
  const pathToFile = path.join(process.cwd(), 'src', 'docs', file);
  
  const markdown = await fs.readFile(pathToFile, 'utf-8');

  return markdown;
};

module.exports = getPolicyMarkdown;
