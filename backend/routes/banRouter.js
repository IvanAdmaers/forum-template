const { Router } = require('express');

const router = Router();

// User constants
const { USER_BOSS_ROLE } = require('../constants/user');

// Validators
const { banValidator } = require('../validators');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const checkRolesMiddleware = require('../middlewares/checkRolesMiddleware');

// Controllers
const { ban } = require('../controllers/banController');

router.post(
  '/',
  authMiddleware(),
  checkRolesMiddleware([USER_BOSS_ROLE]),
  banValidator,
  ban
);

module.exports = router;
