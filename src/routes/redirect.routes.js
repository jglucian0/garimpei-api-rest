const express = require('express');
const router = express.Router();
const shortLinkRepository = require('../repositories/shortLinkRepository');

router.get('/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const originalUrl = await shortLinkRepository.getOriginalUrl(code);

    if (!originalUrl) {
      return res.status(404).send('<h1>Link não encontrado ou expirado.</h1>');
    }

    return res.redirect(301, originalUrl);
  } catch (error) {
    console.error(`[Redirect Error]: ${error.message}`);
    return res.status(500).send('Erro interno do servidor.');
  }
});

module.exports = router;