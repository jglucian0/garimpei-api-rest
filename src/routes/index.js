const express = require('express');
const router = express.Router();

const extractionRoutes = require('./extraction.routes');
const configRoutes = require('./config.routes');
const redirectRoutes = require('./redirect.routes');

router.use('/extract', extractionRoutes);
router.use('/config', configRoutes);

module.exports = router;