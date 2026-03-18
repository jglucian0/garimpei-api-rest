const userConfigRepository = require('../../repositories/userConfigRepository');
const shortLinkRepository = require('../../repositories/shortLinkRepository');
const crypto = require('crypto');
const { appUrl } = require('../../config/env');

class AffiliateCentauroService {
  async generateAffiliateLink(productUrl, userId) {
    // Busca a configuração geral da AWIN
    const userConfig = await userConfigRepository.getUserConfigs(userId, 'AWIN');

    if (!userConfig || !userConfig.tag) {
      throw new Error('AWIN_TAG_NOT_FOUND');
    }

    const awinmid = '17806'; // ID da Centauro
    const awinaffid = userConfig.tag;

    // Monta o link longo padrão da Awin
    const awinLongLink = `https://www.awin1.com/cread.php?awinmid=${awinmid}&awinaffid=${awinaffid}&ued=${encodeURIComponent(productUrl)}`;

    // Encurta usando o sistema já existente
    const shortCode = crypto.randomBytes(3).toString('hex');
    await shortLinkRepository.saveLink(shortCode, awinLongLink, userId);

    const baseUrl = appUrl || 'http://localhost:3001';
    return `${baseUrl}/s/${shortCode}`;
  }
}

module.exports = new AffiliateCentauroService();