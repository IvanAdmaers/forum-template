const UserService = require('../services/UserService');

const ApiError = require('../exceptions/ApiError');

/**
 * This middleware checks does the user have roles
 *
 * @param {array} roles - Array of roles
 */
// eslint-disable-next-line arrow-body-style
const userRolesMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      const { id } = req.user;

      const { roles } = await UserService.findById(id);

      const hasRoles = requiredRoles.every((role) => roles.includes(role));

      if (!hasRoles) {
        return next(ApiError.forbidden('Action for the user is forbidden'));
      }

      return next();
    } catch (e) {
      console.log(e);
      return next(ApiError.internal('User was not checked'));
    }
  };
};

module.exports = userRolesMiddleware;
