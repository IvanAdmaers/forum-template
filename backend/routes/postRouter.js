const { Router } = require('express');

const router = Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Validators
const { postValidator } = require('../validators');

// Controllers
const {
  create,
  get,
  user,
  vote,
  edit,
  list,
  top,
  pin,
} = require('../controllers/postController');

router.post('/', authMiddleware(), postValidator, create);
router.get('/list', authMiddleware(true), list);
router.get('/top', top);
router.post('/:slug/:postId', authMiddleware(), pin);
router.get('/:slug', authMiddleware(true), get);
router.get('/:slug/user', authMiddleware(true), user);
router.put('/:slug/:vote', authMiddleware(), vote);
router.put('/:slug', authMiddleware(), postValidator, edit);

module.exports = router;
