const axios = require('axios');

class UrlResolutionService {
  /**
   * @param {string} url - URL original (curta ou direta)
   * @returns {string} - URL final limpa (sem trackings)
   */
  async resolveFinalUrl(url) {
    try {
      const response = await axios.get(url, {
        maxRedirects: 10,
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        },
        validateStatus: () => true
      });

      const finalUrl =
        response?.request?.res?.responseUrl || response.config.url;

      if (finalUrl.includes('/social/')) {
        const html = response.data;

        // 1️⃣ Pegamos apenas o bloco principal de recomendações
        const sectionMatch = html.match(
          /<ul class="ui-recommendations-list__items-wrapper--single"[\s\S]*?<\/ul>/
        );

        if (sectionMatch) {
          const sectionHtml = sectionMatch[0];

          // 2️⃣ Dentro desse bloco buscamos o link do produto
          const productMatch = sectionHtml.match(
            /https:\/\/(produto|www)\.mercadolivre\.com\.br\/[^"' ]*MLB-?\d+[^"' ]*/i
          );

          if (productMatch) {
            return this.cleanUrl(productMatch[0]);
          }
        }

        throw new Error('Produto não encontrado dentro da seção esperada.');
      }

      return this.cleanUrl(finalUrl);
    } catch (error) {
      console.error(`[UrlResolution] Error resolving URL: ${error.message}`);
      return this.cleanUrl(url);
    }
  }

  cleanUrl(url) {
    if (!url) return url;
    return url.split('#')[0].split('?')[0];
  }
}

module.exports = new UrlResolutionService();