const sessionSingleton = require('../sessionSingleton');
const userConfigRepository = require('../../repositories/userConfigRepository');
const urlResolutionService = require('../urlResolutionService');
const extractProductData = require('../../utils/mercadoLivreExtractor');

class ScraperService {
  async fetchProduct(rawUrl, userId) {
    if (!userId || !rawUrl) throw new Error('The userId and URL parameters are required.');

    const url = await urlResolutionService.resolveFinalUrl(rawUrl);

    const cookies = await userConfigRepository.getUserCookies(userId);
    if (!cookies || !cookies.length) {
      throw new Error('COOKIES_NOT_FOUND');
    }

    let context;
    let page;

    try {
      context = await sessionSingleton.browser.createBrowserContext();
      page = await context.newPage();

      await this.preparePage(page);

      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

      await page.setCookie(...cookies);

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 40000
      });

      const productData = await page.evaluate(extractProductData);

      return productData;

    } catch (error) {
      console.error(`[Scraper Error]: ${error.message}`);
      throw error;
    } finally {
      if (context) {
        await context.close().catch(() => { });
      }
    }
  }

  async preparePage(page) {
    await page.setRequestInterception(true);
    page.on('request', req => {
      const allowedResources = ['document', 'xhr', 'fetch', 'script', 'stylesheet'];
      if (!allowedResources.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }
}

module.exports = new ScraperService();