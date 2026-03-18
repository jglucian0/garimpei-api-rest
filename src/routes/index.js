const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const extractionRoutes = require('./extraction.routes');
const configRoutes = require('./config.routes');
const redirectRoutes = require('./redirect.routes');

router.use('/extract', authMiddleware, extractionRoutes);
router.use('/config', authMiddleware, configRoutes);

module.exports = router;