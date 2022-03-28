const UserService = require('../services/UserService');

exports.email = async (req, res, next) => {
  try {
    const { email } = req.body.user;

    const user = Boolean(await UserService.findByEmail(email));

    return res.json({ success: !user });
  } catch (e) {
    return next(e);
  }
};

exports.username = async (req, res, next) => {
  try {
    const { username } = req.body.user;

    const user = Boolean(await UserService.findByUsername(username));

    return res.json({ success: !user });
  } catch (e) {
    return next(e);
  }
};
