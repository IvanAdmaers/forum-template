const { Router } = require('express');

const router = Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Controllers
const { confirmation, resend } = require('../controllers/emailController');

// Validators
const { emailConfirmationValidator } = require('../validators');

router.post('/confirmation', emailConfirmationValidator, confirmation);
router.post('/resend', authMiddleware(), resend);

module.exports = router;
