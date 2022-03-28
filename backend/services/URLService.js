const { URL } = require('url');

class URLService {
  /**
   * This method gets url protocol
   *
   * @param {string} url - Url
   * @returns {string} Protocol. E.g. http, https, ftp and so on
   */
  getProtocol(url = '') {
    const { protocol } = new URL(url);

    return protocol.replace(/:/, '');
  }
}

module.exports = new URLService();
