const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.post('/cookies', configController.uploadCookies);
router.post('/api', (req, res) => configController.uploadAmazonConfig(req, res));
router.post('/awin', configController.uploadAwinConfig);

module.exports = router;
