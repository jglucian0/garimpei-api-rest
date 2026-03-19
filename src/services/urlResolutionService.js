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

      const finalUrl = response?.request?.res?.responseUrl || response.config.url;

      if (finalUrl.includes('/social/')) {
        const html = response.data;

        const sectionMatch = html.match(
          /<ul class="ui-recommendations-list__items-wrapper--single"[\s\S]*?<\/ul>/
        );

        if (sectionMatch) {
          const sectionHtml = sectionMatch[0];

          const productMatch = sectionHtml.match(
            /https:\/\/(produto|www)\.mercadolivre\.com\.br\/[^"' ]*MLB-?\d+[^"' ]*/i
          );

          if (productMatch) {
            return this.cleanUrl(productMatch[0]);
          }
        }

        throw new Error('Product not found in the expected section.');
      }

      return this.cleanUrl(finalUrl);
    } catch (error) {
      console.error(`[UrlResolution] Error resolving URL: ${error.message}`);
      return this.cleanUrl(url);
    }
  }

  cleanUrl(url) {
    if (!url) return url;

    let cleaned = url.split('#')[0];

    if (cleaned.includes('centauro.com.br')) {
      const urlObj = new URL(cleaned);
      const colorParam = urlObj.searchParams.get('cor');

      const finalBase = cleaned.split('?')[0];
      return colorParam ? `${finalBase}?cor=${colorParam}` : finalBase;
    }

    return cleaned.split('?')[0];
  }
}

module.exports = new UrlResolutionService();
