const { Router } = require('express');

const router = Router();

const {
  getContacts,
  getSitemap,
} = require('../controllers/interactionController');

const { captchaTokenValidator } = require('../validators');

router.post(
  '/contacts',
  captchaTokenValidator('reCaptchaV2', 'token'),
  getContacts
);

router.get('/sitemap.xml', getSitemap);

module.exports = router;
