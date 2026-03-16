const cookieHelper = require('../utils/cookieHelper');
const cookieValidatorService = require('../services/cookieValidatorService');
const userConfigRepository = require('../repositories/userConfigRepository');

class ConfigController {

  async uploadCookies(req, res) {
    try {
      const { userId, cookie } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'The userId field is mandatory.' });
      }

      if (!cookie || typeof cookie !== 'string') {
        return res.status(400).json({ error: 'The cookie text was not sent correctly.' });
      }

      const cookiesArray = cookieHelper.parseCookieHeader(cookie);

      const isValid = await cookieValidatorService.verifySessionActive(cookiesArray);

      if (!isValid) {
        return res.status(400).json({
          error: 'This cookie is invalid or has already expired. Please generate a new one.'
        });
      }

      await userConfigRepository.saveUserCookies(userId, 'ML', cookiesArray);

      return res.status(200).json({
        message: 'Cookies successfully validated and saved in the database!',
        active: true
      });

    } catch (error) {
      console.error('[ConfigController] Error:', error.message);
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ConfigController();