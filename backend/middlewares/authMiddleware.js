const ApiError = require('../exceptions/ApiError');
const TokenService = require('../services/TokenService');
const UserService = require('../services/UserService');
const CookieService = require('../services/CookieService');

/**
 * This middleware checks user authorization
 *
 * @param {boolean} optional - Is authentication optional
 */
const authMiddleware = (optional = false) => {
  const errorText = 'User was not verified';
  const isOptional = optional;

  /**
   * Cases:
   * - no access & refresh tokens ✔ | test ✔
   * - no access token ✔ | test ✔
   * - there is access token ✔ | test ✔
   * - no refresh token ✔ | test ✔
   * - there is access & refresh tokens ✔ | test ✔
   */

  /**
   * This middleware checks user authorization
   *
   * @param {object} req - Express req
   * @param {object} res - Express res
   * @param {function} next - Express next
   */
  return async (req, res, next) => {
    try {
      const { cookies } = req;

      const accessToken = cookies['access-token'];
      const refreshToken = cookies['refresh-token'];

      // Case - there are no access and refresh tokens
      if (!accessToken && !refreshToken && !isOptional) {
        return next(ApiError.unauthorized(errorText));
      }

      // Case - if authentication optional
      if (!accessToken && !refreshToken && isOptional) {
        req.user = null;

        return next();
      }

      // Case - there is no access token
      if (!accessToken) {
        // Verify refresh token
        const refreshTokenData = TokenService.verify(refreshToken);

        // If there is an error
        if (refreshTokenData.error) {
          return next(ApiError.unauthorized(errorText));
        }

        // Check refresh token is user collection
        const tokenExists = await TokenService.refreshTokenExists(
          refreshTokenData.token.id,
          refreshToken
        );

        // Token doesn't exist in DB
        if (!tokenExists) {
          return next(ApiError.unauthorized(errorText));
        }

        /* Token was found */

        // Get user info
        const user = await UserService.findById(refreshTokenData.token.id);

        const userData = {
          id: user._id.toString(),
          username: user.username,
          roles: user.roles,
        };

        // Create new access token
        const newAccessToken = TokenService.createAccessToken(
          user._id,
          user.username,
          user.roles
        );

        // Set new access token to cookies
        CookieService.setAccessToken(res, newAccessToken);

        // Add user info in req.user

        req.user = { ...userData };

        return next();
      }

      // Case - there is access token
      if (accessToken) {
        // Verify token
        const accessTokenData = TokenService.verify(accessToken);

        // If access token is correct
        if (accessTokenData.token && !accessTokenData.error) {
          const userData = { ...accessTokenData.token };

          delete userData.iat;
          delete userData.exp;

          req.user = userData;

          return next();
        }

        // If there is an error and there is no refresh token
        if (accessTokenData.error && !refreshToken) {
          return next(ApiError.unauthorized(errorText));
        }

        // If there is an error and is refresh token
        const refreshTokenData = TokenService.verify(refreshToken);

        // If refresh token is not valid
        if (refreshTokenData.error) {
          return next(ApiError.unauthorized(errorText));
        }

        // Refresh token is valid, check it in DB
        const refreshTokenExists = await TokenService.refreshTokenExists(
          refreshTokenData.token.id,
          refreshToken
        );

        if (!refreshTokenExists) {
          return next(ApiError.unauthorized(errorText));
        }

        /* Refresh token was found. Create new access token */

        // Get user info
        const user = await UserService.findById(refreshTokenData.token.id);

        const userData = {
          id: user._id.toString(),
          username: user.username,
          roles: user.roles,
        };

        // Create new access token
        const newAccessToken = TokenService.createAccessToken(
          user._id,
          user.username,
          user.roles
        );

        // Set new access token to cookies
        CookieService.setAccessToken(res, newAccessToken);

        req.user = { ...userData };

        return next();
      }

      return next(ApiError.unauthorized(errorText));
    } catch (e) {
      console.log(e);
      return next(ApiError.unauthorized(errorText));
    }
  };
};

module.exports = authMiddleware;
