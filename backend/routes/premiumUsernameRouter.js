const { Router } = require('express');

const router = Router();

// User constants
const { USER_BOSS_ROLE } = require('../constants/user');

// Validators
const {
  premiumUsernameValidator,
  editPremiumUsernameValidator,
} = require('../validators');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const checkRolesMiddleware = require('../middlewares/checkRolesMiddleware');

// Controllers
const { add, edit, list } = require('../controllers/premiumUsernameController');

router.post(
  '/',
  authMiddleware(),
  checkRolesMiddleware([USER_BOSS_ROLE]),
  premiumUsernameValidator,
  add
);

router.put(
  '/',
  authMiddleware(),
  checkRolesMiddleware([USER_BOSS_ROLE]),
  editPremiumUsernameValidator,
  edit
);

router.get('/list', list);

module.exports = router;
