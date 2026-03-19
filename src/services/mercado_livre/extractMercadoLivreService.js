const sessionSingleton = require('../sessionSingleton');
const userConfigRepository = require('../../repositories/userConfigRepository');
const urlResolutionService = require('../urlResolutionService');
const extractProductData = require('../../utils/mercadoLivreExtractor');

class ScraperService {
  async fetchProduct(rawUrl, userId) {
    if (!userId || !rawUrl) throw new Error('The userId and URL parameters are required.');

    const url = await urlResolutionService.resolveFinalUrl(rawUrl);

    const userConfig = await userConfigRepository.getUserConfigs(userId, 'ML');

    if (!userConfig || !userConfig.cookies || !userConfig.cookies.length) {
      throw new Error('ML_COOKIES_NOT_FOUND');
    }

    const cookies = userConfig.cookies;

    let context;
    let page;

    try {
      const browser = await sessionSingleton.initBrowser();
      context = await browser.createBrowserContext();
      page = await context.newPage();

      await this.preparePage(page);

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      );

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
        await context.close().catch(() => {});
      }
    }
  }

  async preparePage(page) {
    await page.setRequestInterception(true);
    page.on('request', (req) => {
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
