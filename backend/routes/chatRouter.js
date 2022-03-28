const { Router } = require('express');

const router = Router();

// User constants
const { USER_BOSS_ROLE } = require('../constants/user');

// Validators
const { chatValidator, getChatMessagesValidator } = require('../validators');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const checkRolesMiddleware = require('../middlewares/checkRolesMiddleware');

// Controllers
const { create, get, list } = require('../controllers/chatController');

router.post(
  '/',
  authMiddleware(),
  checkRolesMiddleware([USER_BOSS_ROLE]),
  chatValidator,
  create
);
router.get('/list', authMiddleware(), list);
router.get('/:id', authMiddleware(), getChatMessagesValidator, get);

module.exports = router;
