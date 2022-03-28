const { Router } = require('express');

const router = Router();

// Controllers
const {
  create,
  list,
  get,
  join,
  unjoin,
  isMember,
  searchByUserGroups,
  topGroups,
  posts,
  isUrlAvailable,
} = require('../controllers/groupsController');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Validators
const { createGroupValidator, groupUrlValidator } = require('../validators');

const createGroupValidators = [groupUrlValidator, createGroupValidator];

router.get('/list', list);
router.get('/top', topGroups);
router.get('/:url/posts', authMiddleware(true), posts);
router.get('/:url', authMiddleware(true), get);
router.post('/', authMiddleware(), createGroupValidators, create);
router.post('/:url/join', authMiddleware(), join);
router.post('/:url/unjoin', authMiddleware(), unjoin);
router.get('/:url/isMember', authMiddleware(true), isMember);
router.get('/user/search', authMiddleware(), searchByUserGroups);
router.post('/url/available', groupUrlValidator, isUrlAvailable);

module.exports = router;
