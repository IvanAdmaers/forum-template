const { Router } = require('express');

const router = Router();

// Controllers
const { search } = require('../controllers/searchController');

// Validators
const { searchValidator } = require('../validators');

router.get('/', searchValidator, search);

module.exports = router;
