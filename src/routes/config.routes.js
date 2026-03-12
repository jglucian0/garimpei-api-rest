const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.post('/cookies', configController.uploadCookies);

module.exports = router;