const { Router } = require('express');

const router = Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Controllers
const { add, get, vote } = require('../controllers/commentController');

// Validators
const { commentValidator } = require('../validators');

router.post('/:postSlug', authMiddleware(), commentValidator, add);
router.get('/:postSlug', authMiddleware(true), get);
router.put('/:postSlug/:commentId/:vote', authMiddleware(), vote);

module.exports = router;
