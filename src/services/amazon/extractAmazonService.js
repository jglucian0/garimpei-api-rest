const sessionSingleton = require('../sessionSingleton');
const urlResolutionService = require('../urlResolutionService');
const extractAmazonProductData = require('../../utils/amazonExtractor');

class ExtractAmazonService {
  async fetchProduct(rawUrl) {
    const finalUrl = await urlResolutionService.resolveFinalUrl(rawUrl);

    const asinMatch = finalUrl.match(
      /(?:dp|o|ASIN|gp\/product|gp\/offer-listing|aw\/d)\/([a-zA-Z0-9]{10})/i
    );

    if (!asinMatch) {
      throw new Error(
        "The ASIN could not be found in the Amazon link. Make sure it's a valid product link."
      );
    }

    const asin = asinMatch[1];
    const cleanUrl = `https://www.amazon.com.br/dp/${asin}`;

    let context;
    let page;

    try {
      const browser = await sessionSingleton.initBrowser();
      context = await browser.createBrowserContext();
      page = await context.newPage();

      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
      );

      await page.goto(cleanUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 40000
      });

      const productData = await page.evaluate(extractAmazonProductData);

      return { ...productData, url: cleanUrl, asin };
    } catch (error) {
      console.error(`[Amazon Scraper Error]: ${error.message}`);
      throw error;
    } finally {
      if (context) {
        await context.close().catch(() => {});
      }
    }
  }
}

module.exports = new ExtractAmazonService();
