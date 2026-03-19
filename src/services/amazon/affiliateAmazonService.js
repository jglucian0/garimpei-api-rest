const userConfigRepository = require('../../repositories/userConfigRepository');
const shortLinkRepository = require('../../repositories/shortLinkRepository');
const crypto = require('crypto');

class AffiliateAmazonService {
  async generateAffiliateLink(asin, userId) {
    const userConfig = await userConfigRepository.getUserConfigs(userId, 'AMAZON');

    if (!userConfig || !userConfig.tag) {
      throw new Error('AMAZON_TAG_NOT_FOUND');
    }

    const amazonLongLink = `https://www.amazon.com.br/dp/${asin}?tag=${userConfig.tag}`;
    const baseUrl =
      process.env.NODE_ENV === 'production' ? 'https://api.garimpei.com' : 'http://localhost:3001';

    const existingCode = await shortLinkRepository.getExistingCode(amazonLongLink, userId);
    if (existingCode) {
      return `${baseUrl}/s/${existingCode}`;
    }

    const shortCode = crypto.randomBytes(3).toString('hex');
    await shortLinkRepository.saveLink(shortCode, amazonLongLink, userId);

    return `${baseUrl}/s/${shortCode}`;
  }
}

module.exports = new AffiliateAmazonService();
