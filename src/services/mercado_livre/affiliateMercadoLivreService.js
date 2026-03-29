const axios = require('axios');
const userConfigRepository = require('../../repositories/userConfigRepository');

class AffiliateService {
  async generateAffiliateLink(originalLink, userId) {
    const userConfig = await userConfigRepository.getUserConfigs(userId, 'ML');

    if (!userConfig || !userConfig.cookies || !userConfig.cookies.length) {
      throw new Error('COOKIES_NOT_FOUND');
    }

    if (!userConfig.tag) {
      throw new Error('ML_TAG_NOT_FOUND');
    }

    const { cookies, tag } = userConfig;

    if (!tag) {
      throw new Error('TAG_NOT_FOUND_IN_DB');
    }

    const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
    if (!cookieString.includes('ssid=')) {
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
            origin: 'https://www.mercadolivre.com.br',
            referer: 'https://www.mercadolivre.com.br/afiliados/linkbuilder',
            'user-agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            cookie: cookieString
          },
          timeout: 8000
        }
      );

      // 👇 DETETIVE 1: Se a requisição passar, o que veio no corpo?
      console.log('\n--- [DETETIVE] RESPOSTA DA API DO ML (TRY) ---');
      console.log(typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
      console.log('----------------------------------------------\n');

      const shortLink = data?.urls?.[0]?.short_url;
      if (!shortLink) throw new Error('INVALID_API_RESPONSE');

      return shortLink;

    } catch (error) {
      // 👇 DETETIVE 2: Se o ML der bloco (Status 403, 429, etc), a resposta cai aqui!
      console.log('\n--- [DETETIVE] ERRO NA API DO ML (CATCH) ---');
      if (error.response) {
        console.log(`Status do Erro: ${error.response.status}`);
        console.log('Corpo da Resposta (Possível Captcha/HTML):');
        console.log(
          typeof error.response.data === 'object'
            ? JSON.stringify(error.response.data, null, 2)
            : error.response.data
        );
      } else {
        console.log(`Erro de Timeout ou Rede: ${error.message}`);
      }
      console.log('--------------------------------------------\n');

      console.error(`[AffiliateService] Error generating link: ${error.message}`);
      throw new Error('REQUEST_FAILED', { cause: error });
    }
  }
}

module.exports = new AffiliateService();