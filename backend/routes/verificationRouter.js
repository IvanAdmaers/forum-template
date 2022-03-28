const { Router } = require('express');

const router = Router();

// Constants
const { USER_BOSS_ROLE } = require('../constants/user');

// Controllers
const { add, remove } = require('../controllers/verificationController');

// Validators
const authMiddleware = require('../middlewares/authMiddleware');
const checkRolesMiddleware = require('../middlewares/checkRolesMiddleware');
const { verificationValidator } = require('../validators');

router.post(
  '/:action',
  authMiddleware(),
  checkRolesMiddleware([USER_BOSS_ROLE]),
  verificationValidator,
  (req, res, next) =>
    req.params.action === 'add' ? add(req, res, next) : remove(req, res, next)
);

module.exports = router;
