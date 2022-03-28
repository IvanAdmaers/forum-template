const { Router } = require('express');

const router = Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Controllers
const {
  registration,
  authentication,
  posts,
  getUserData,
  avatar,
  logout,
} = require('../controllers/usersController');

// Validators
const {
  emailValidator,
  usernameValidator,
  passwordValidator,
} = require('../validators');

const registrationValidators = [
  emailValidator,
  usernameValidator,
  passwordValidator,
];

// Users registration
router.post('/', registrationValidators, registration);
router.get('/:username', authMiddleware(true), getUserData);
router.post('/login', authentication);
router.get('/posts/:username', authMiddleware(true), posts);
router.put('/avatar', authMiddleware(), avatar);
router.post('/logout', authMiddleware(), logout);

module.exports = router;
