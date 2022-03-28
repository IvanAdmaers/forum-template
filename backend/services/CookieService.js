const Config = require('./Config');
const { isProduction } = require('../utills');

const { CONNECTION_TOKEN_COOKIE_NAME } = require('../constants/sockets');

class CookieService extends Config {
  constructor() {
    super(
      '_accessTokenExpiresTime _refreshTokenExpiresTime _socketRequestTokenExpiresTime'
    );

    this._secureMode = isProduction();
  }

  _setTokenCookie(res = {}, type = '', token = '') {
    if (type !== 'access' && type !== 'refresh') {
      throw new Error('Token type is not known');
    }

    const maxAge =
      type === 'access'
        ? this._accessTokenExpiresTime
        : this._refreshTokenExpiresTime;

    res.cookie(`${type}-token`, token, {
      httpOnly: this._secureMode,
      maxAge,
      secure: this._secureMode,
    });
  }

  /**
   * This method sets access token cookie
   *
   * @param {object} res - Express res
   * @param {string} token - Access token
   * @returns {boolean} True if everything ok
   */
  setAccessToken(res = {}, token = '') {
    this._setTokenCookie(res, 'access', token);

    return true;
  }

  /**
   * This method sets refresh token cookie
   *
   * @param {object} res - Express res
   * @param {string} token - Refresh token
   * @returns {boolean} True if everything ok
   */
  setRefreshToken(res = {}, token = '') {
    this._setTokenCookie(res, 'refresh', token);

    return true;
  }

  setRequestSocketConnectionToken(res = {}, token = '') {
    res.cookie(CONNECTION_TOKEN_COOKIE_NAME, token, {
      httpOnly: this._secureMode,
      maxAge: this._socketRequestTokenExpiresTime,
      secure: this._secureMode,
    });

    return true;
  }

  /**
   * This method cleans cookie by name
   *
   * @param {Object} res - Express res
   * @param {string} cookieName - Cookie name to clean
   * @returns {boolean} True if everything ok
   */
  cleanCookie(res = {}, cookieName = '') {
    res.clearCookie(cookieName);

    return true;
  }
}

module.exports = new CookieService();
