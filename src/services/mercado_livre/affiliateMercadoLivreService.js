const axios = require('axios');
const userConfigRepository = require('../../repositories/userConfigRepository');

class AffiliateService {

  async generateAffiliateLink(originalLink, userId, tag) {
    if (!tag) {
      throw new Error('TAG_REQUIRED');
    }

    const cookies = await userConfigRepository.getUserCookies(userId);
    if (!cookies || !cookies.length) {
      throw new Error('COOKIES_NOT_FOUND');
    }

    const ssid = cookies.find(c => c.name === 'ssid')?.value;
    if (!ssid) {
      throw new Error('NO_SSID');
    }

    try {
      const { data } = await axios.post(
        'https://www.mercadolivre.com.br/affiliate-program/api/v2/affiliates/createLink',
        {
          urls: [originalLink],
          tag: tag
        },
        {
          headers: {
            'content-type': 'application/json',
            'x-requested-with': 'XMLHttpRequest',
            'origin': 'https://www.mercadolivre.com.br',
            'referer': 'https://www.mercadolivre.com.br/afiliados/linkbuilder',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'cookie': `ssid=${ssid}`
          },
          timeout: 8000
        }
      );

      const shortLink = data?.urls?.[0]?.short_url;
      if (!shortLink) throw new Error('INVALID_API_RESPONSE');

      return shortLink;

    } catch (error) {
      console.error(`[AffiliateService] Error generating link: ${error.message}`);
      throw new Error('REQUEST_FAILED');
    }
  }
}

module.exports = new AffiliateService();