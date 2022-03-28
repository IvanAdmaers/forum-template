const { Router } = require('express');

const router = Router();

// Validators
const { requestSocketConnectionValidator } = require('../validators');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Controllers
const { request } = require('../controllers/requestSocketConnectionController');

router.get('/', authMiddleware(), requestSocketConnectionValidator, request);

module.exports = router;
