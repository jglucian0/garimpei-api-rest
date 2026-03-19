const express = require('express');
const router = express.Router();
const extractionController = require('../controllers/extractionController');

router.post('/', (req, res) => {
  extractionController.extractProduct(req, res);
});

module.exports = router;
