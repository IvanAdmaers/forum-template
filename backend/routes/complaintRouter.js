const { Router } = require('express');

const router = Router();

const { USER_BOSS_ROLE, USER_MODERATOR_ROLE } = require('../constants/user');

const authMiddleware = require('../middlewares/authMiddleware');
const checkRolesMiddleware = require('../middlewares/checkRolesMiddleware');

const {
  complaintValidator,
  complaintDecisionValidator,
} = require('../validators');

const { add, list, decision } = require('../controllers/complaintController');

// Add a complaint against a post or comment
router.post('/', authMiddleware(), complaintValidator, add);
router.get(
  '/',
  authMiddleware(),
  checkRolesMiddleware([USER_BOSS_ROLE, USER_MODERATOR_ROLE]),
  list
);
router.delete(
  '/',
  authMiddleware(),
  checkRolesMiddleware([USER_BOSS_ROLE, USER_MODERATOR_ROLE]),
  complaintDecisionValidator,
  decision
);

module.exports = router;
