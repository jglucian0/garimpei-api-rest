const cookieHelper = require('../utils/cookieHelper');
const cookieValidatorService = require('../services/cookieValidatorService');
const userConfigRepository = require('../repositories/userConfigRepository');

class ConfigController {

  async uploadCookies(req, res) {
    try {
      const { userId, cookies, tag } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'The userId field is mandatory.' });
      }

      if (!cookies || typeof cookies !== 'string') {
        return res.status(400).json({ error: 'The cookie text was not sent correctly.' });
      }

      if (!tag) {
        return res.status(400).json({ error: 'The tag field is mandatory for generating affiliate links.' });
      }

      const cookiesArray = cookieHelper.parseCookieHeader(cookies);

      const isValid = await cookieValidatorService.verifySessionActive(cookiesArray);

      if (!isValid) {
        return res.status(400).json({
          error: 'This cookie is invalid or has already expired. Please generate a new one.'
        });
      }

      await userConfigRepository.saveUserConfigs(userId, 'ML', cookiesArray, tag);

      return res.status(200).json({
        message: 'Cookies successfully validated and saved in the database!',
        active: true
      });

    } catch (error) {
      console.error('[ConfigController] Error:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  async uploadAmazonConfig(req, res) {
    try {
      const { userId, tag } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'The userId field is mandatory.' });
      }

      if (!tag) {
        return res.status(400).json({ error: 'The tag field is mandatory for generating Amazon affiliate links.' });
      }

      // Salva no banco com marketplace 'AMAZON' e cookies vazios '[]'
      await userConfigRepository.saveUserConfigs(userId, 'AMAZON', [], tag);

      return res.status(200).json({
        message: 'Amazon Tag successfully validated and saved in the database!',
        active: true
      });

    } catch (error) {
      console.error('[ConfigController] Error:', error.message);
      return res.status(500).json({ error: 'Internal error while saving Amazon configuration.' });
    }
  }
}

module.exports = new ConfigController();