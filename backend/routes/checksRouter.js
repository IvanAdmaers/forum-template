const { Router } = require('express');

const router = Router();

// Validators
const { usernameValidator, emailValidator } = require('../validators');

// Controllers
const { email, username } = require('../controllers/checksController');

router.post('/email', emailValidator, email);
router.post('/username', usernameValidator, username);

module.exports = router;
