const axios = require('axios');

class UrlResolutionService {
  /**
   * @param {string} url - URL original (curta ou direta)
   * @returns {string} - URL final limpa (sem trackings)
   */
  async resolveFinalUrl(url) {
    if (url.includes('www.mercadolivre.com.br/') || url.includes('produto.mercadolivre.com.br/')) {
      return this.cleanUrl(url);
    }

    try {
      const response = await axios.get(url, {
        maxRedirects: 10,
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
        },
        validateStatus: () => true
      });

      let finalUrl = response.request.res.responseUrl || response.config.url;

      if (finalUrl.includes('/social/')) {
        const html = response.data;

        const exactCardMatch = html.match(
          /poly-card[^>]*>[\s\S]*?href=["'](https:\/\/(www|produto)\.mercadolivre\.com\.br\/[a-zA-Z0-9-]+\/(p\/)?MLB\d+[^"'\s]*)["']/i
        );

        if (exactCardMatch) {
          return this.cleanUrl(exactCardMatch[1]);
        }
        throw new Error('Nenhum poly-card válido encontrado no HTML da página social.');
      }

      return this.cleanUrl(finalUrl);

    } catch (error) {
      console.error(`[UrlResolution] Erro ao resolver URL: ${error.message}`);
      return this.cleanUrl(url);
    }
  }

  cleanUrl(url) {
    if (!url) return url;
    return url.split('#')[0].split('?')[0];
  }
}

module.exports = new UrlResolutionService();