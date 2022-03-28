const UserService = require('../services/UserService');

const ApiError = require('../exceptions/ApiError');

const checkRolesMiddleware = (requiredRoles = []) => {
  const errorText = 'User roles was not checked';

  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      const user = await UserService.findById(userId);

      const { roles } = user;

      const every = requiredRoles.every((role) => roles.includes(role));

      if (!every) {
        return next(ApiError.forbidden('You have no permissions to this'));
      }

      return next();
    } catch (e) {
      console.log(e);
      return next(ApiError.internal(errorText));
    }
  };
};

module.exports = checkRolesMiddleware;
