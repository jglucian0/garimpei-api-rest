const sessionSingleton = require('../sessionSingleton');
const urlResolutionService = require('../urlResolutionService');
const extractCentauroProductData = require('../../utils/centauroExtractor');

class ExtractCentauroService {
  async fetchProduct(rawUrl) {
    const finalUrl = await urlResolutionService.resolveFinalUrl(rawUrl);
    const cleanUrl = finalUrl;

    let page;

    try {
      const browser = await sessionSingleton.initBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1366, height: 768 });

      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
      });

      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const allowedTypes = ['document', 'script', 'xhr', 'fetch', 'stylesheet', 'image', 'font'];

        if (allowedTypes.includes(req.resourceType())) {
          req.continue();
        } else {
          req.abort();
        }
      });

      await page.goto(cleanUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 40000
      });

      await new Promise(r => setTimeout(r, 1000));

      let pageTitle = await page.title();

      if (pageTitle.includes('Access Denied') || pageTitle.includes('Denied') || pageTitle.includes('Just a moment')) {
        console.log('[Centaur] Akamai detected. Executing quick evasion...');

        await Promise.all([
          page.mouse.move(300 + Math.random() * 100, 400 + Math.random() * 100),
          page.evaluate(() => window.scrollBy(0, 300))
        ]);

        await new Promise(r => setTimeout(r, 1200));

        await page.reload({ waitUntil: 'domcontentloaded' });

        pageTitle = await page.title();
        if (pageTitle.includes('Access Denied')) {
          throw new Error('Persistent blocking on Centauro. Please try again in a moment.');
        }
      }

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