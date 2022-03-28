const { Router } = require('express');

const router = Router();

// Validators
const { passwordValidator } = require('../validators');

// Controllers
const { requestReset, reset } = require('../controllers/passwordController');

router.post('/reset/request', requestReset);
router.post('/reset', passwordValidator, reset);

module.exports = router;
