const sessionSingleton = require('../sessionSingleton');
const urlResolutionService = require('../urlResolutionService');
const extractCentauroProductData = require('../../utils/centauroExtractor');

class ExtractCentauroService {
  async fetchProduct(rawUrl) {
    const finalUrl = await urlResolutionService.resolveFinalUrl(rawUrl);
    const cleanUrl = finalUrl; // Preserva parâmetros de cor configurados no service

    let page;

    try {
      const browser = await sessionSingleton.initBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1366, height: 768 });

      // Mantendo os headers leves exatamente como na Nike
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      });

      await page.setRequestInterception(true);
      page.on('request', (req) => {
        // Permitimos o essencial para o fingerprint parecer real
        const allowedTypes = ['document', 'script', 'xhr', 'fetch', 'stylesheet', 'image', 'font'];

        if (allowedTypes.includes(req.resourceType())) {
          req.continue();
        } else {
          req.abort();
        }
      });

      // 1. Navegação inicial rápida
      await page.goto(cleanUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 40000
      });

      // Pequeno atraso tático (o "atrasinho")
      // Isso ajuda a Akamai a processar o hardware-concurrency e outros testes de JS
      await new Promise(r => setTimeout(r, 1000));

      let pageTitle = await page.title();

      // 2. Avaliação de bloqueio e Teatro de Evasão
      if (pageTitle.includes('Access Denied') || pageTitle.includes('Denied') || pageTitle.includes('Just a moment')) {
        console.log('[Centauro] Akamai detectado. Executando evasão rápida...');

        // Movimento humano sutil
        await Promise.all([
          page.mouse.move(300 + Math.random() * 100, 400 + Math.random() * 100),
          page.evaluate(() => window.scrollBy(0, 300))
        ]);

        // Espera o cookie "maturar"
        await new Promise(r => setTimeout(r, 1200));

        // Recarrega a página forçando a passagem
        await page.reload({ waitUntil: 'domcontentloaded' });

        pageTitle = await page.title();
        if (pageTitle.includes('Access Denied')) {
          throw new Error('Bloqueio persistente na Centauro. Tente novamente em instantes.');
        }
      }

      // 3. Extração dos dados
      const productData = await page.evaluate(extractCentauroProductData);

      return { ...productData, url: cleanUrl };

    } catch (error) {
      console.error(`[Centauro Scraper Error]: ${error.message}`);
      throw error;
    } finally {
      if (page) {
        await page.close().catch(() => { });
      }
    }
  }
}

module.exports = new ExtractCentauroService();