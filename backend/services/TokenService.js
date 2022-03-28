const jwt = require('jsonwebtoken');

const Token = require('../models/TokenModel');
const UserService = require('./UserService');
const Config = require('./Config');

const { uuid, toObjectId } = require('../utills');

class TokenService extends Config {
  constructor() {
    super(
      '_accessTokenExpiresTime _refreshTokenExpiresTime _confirmationTokenExpiresTime _resetPasswordTokenExpiresTime _socketRequestTokenExpiresTime'
    );
    this._secretKey = process.env.SECRET_KEY;
  }

  /**
   * This method defines token alive time
   *
   * @param {string} type - Token type
   * @returns {number} Time
   */
  _getTokenTime(type = '') {
    switch (type) {
      case 'access':
        return this._accessTokenExpiresTime;

      case 'refresh':
        return this._refreshTokenExpiresTime;

      case 'confirmation':
        return this._confirmationTokenExpiresTime;

      case 'reset-password':
        return this._resetPasswordTokenExpiresTime;

      case 'socket-request':
        return this._socketRequestTokenExpiresTime;

      default:
        throw new Error('Token type is not known');
    }
  }

  /**
   * This method generates token
   *
   * @param {string} type - Token type
   * @param {any} payload - Token payload
   * @returns {string} Token
   */
  _generateToken(type = '', payload) {
    const types = [
      'access',
      'refresh',
      'confirmation',
      'reset-password',
      'socket-request',
    ];

    if (!types.includes(type)) {
      throw new Error(`Token must has type ${types.join(', ')} it has ${type}`);
    }

    const expiresIn = this._getTokenTime(type);

    const token = jwt.sign(payload, this._secretKey, {
      expiresIn: `${expiresIn}ms`,
    });

    return token;
  }

  /**
   * This method creates access token
   *
   * @param {string} userId - User id
   * @param {string} username - User username
   * @param {array} roles - Array of user roles
   * @returns {string} Access token
   */
  createAccessToken(userId = '', username = '', roles = []) {
    const token = this._generateToken('access', {
      id: userId,
      username,
      roles,
    });

    return token;
  }

  /**
   * This method creates refresh token
   *
   * @param {string} userId - User id
   * @returns {string} Refresh token
   */
  createRefreshToken(userId = '') {
    const token = this._generateToken('refresh', { id: userId });

    return token;
  }

  /**
   * This method creates a socket request token
   *
   * @param {Object} payload - Token data
   * @returns {string} JWT token
   */
  createSocketRequestToken(payload = {}) {
    const token = this._generateToken('socket-request', payload);

    return token;
  }

  /**
   * This method verifies a token
   *
   * @param {string} token - Token to verify
   * @returns {Object} Object with error property. If it has error, error property contains error description. Token info in token property
   */
  verify(token = '') {
    return jwt.verify(token, this._secretKey, (err, decoded) => {
      if (err) {
        return { error: err.message, token: null };
      }

      return {
        error: null,
        token: decoded,
      };
    });
  }

  /**
   * This method saves refresh token in DB
   *
   * @async
   * @param {string} userId - User id
   * @param {string} token - Refresh token
   * @returns {Promise<boolean>} True if everything good
   */
  async saveRefreshToken(userId = '', token = '') {
    // Check if collection already has documents with user refresh tokens
    const document = await Token.findOne({
      user: toObjectId(userId),
    });

    // New user, new document
    if (!document) {
      const newToken = new Token({
        user: userId,
        refreshTokens: [token],
      });

      const { _id } = await newToken.save();

      // Connect document with user
      await UserService.connectWithDocument(userId, _id, 'tokens');

      return true;
    }

    // Add new refresh token
    document.refreshTokens.push(token);

    await document.save();

    return true;
  }

  /**
   * This method generates email confirmation token and code
   *
   * @param {string} userId - User id
   * @returns {object} Object with token and code fields
   */
  createEmailConfirmationData(userId = '') {
    // Create uniq confirmation code
    const code = uuid().slice(0, 6);

    // Generate a token
    const token = this._generateToken('confirmation', { code, userId });

    return { token, code };
  }

  /**
   * This method generates reset password token and code
   *
   * @param {string} userId - User id
   * @returns {object} Object with token and code fields
   */
  createResetPasswordData(userId = '') {
    // Create uniq confirmation code
    const code = uuid().slice(0, 6);

    // Generate a token
    const token = this._generateToken('reset-password', { code, userId });

    return { token, code };
  }

  /**
   * This method checks exists token in user tokens collection
   *
   * @async
   * @param {string} userId - User id from token
   * @param {string} token - Refresh token
   * @returns {Promise<boolean>} True if token exists
   */
  async refreshTokenExists(userId = '', token = '') {
    const document = await Token.findOne({
      user: toObjectId(userId),
    })
      .select('refreshTokens')
      .lean();

    if (!document) {
      return false;
    }

    if (document.refreshTokens.includes(token)) {
      return true;
    }

    return false;
  }

  /**
   * This method deletes all user refresh tokens
   *
   * @param {string} userId - User id
   * @returns {Promise<boolean>} True if everything ok
   */
  async deleteAllRefreshTokens(userId = '') {
    await Token.findOneAndUpdate(
      { user: toObjectId(userId) },
      { $set: { refreshTokens: [] } }
    );

    return true;
  }
}

module.exports = new TokenService();
