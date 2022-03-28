const fs = require('fs/promises');

class FileSystem {
  /**
   * This method checks path exists
   *
   * @async
   * @param {string} path - Path
   * @returns {<Promise>boolean} True if exists
   */
  async checkExists(path = '') {
    try {
      await fs.access(path);

      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * This method creates or writes files by path
   *
   * @async
   * @param {string} path - Path
   * @param {any} body - File body
   * @returns {<Promise>boolean} True if created
   */
  async writeFile(path = '', body) {
    try {
      await fs.writeFile(path, body);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /**
   * This function reads file
   *
   * @async
   * @param {string} path - Path to file
   * @param {string} encoding - Optional encoding. By default utf-8
   * @returns {<Promise>string} File body
   */
  async readFile(path = '', encoding = 'utf-8') {
    try {
      const fileBody = await fs.readFile(path, { encoding });

      return fileBody;
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  }
}

module.exports = new FileSystem();
