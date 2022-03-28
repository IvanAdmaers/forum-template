const { Router } = require('express');

const router = Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');

// Controllers
const { upload, uploadByUrl } = require('../controllers/imagesController');

router.post('/', authMiddleware(), upload);
router.post('/byUrl', authMiddleware(), uploadByUrl);

module.exports = router;
