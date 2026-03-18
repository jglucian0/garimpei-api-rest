const sessionSingleton = require('../sessionSingleton');
const urlResolutionService = require('../urlResolutionService');
const extractNikeProductData = require('../../utils/nikeExtractor');

class ExtractNikeService {
  async fetchProduct(rawUrl) {
    const finalUrl = await urlResolutionService.resolveFinalUrl(rawUrl);
    const cleanUrl = finalUrl;

    let page;

    try {
      const browser = await sessionSingleton.initBrowser();
      page = await browser.newPage();

      await page.setViewport({ width: 1366, height: 768 });

      // --- DIFERENÇA CRÍTICA PARA NIKE ---
      // A Nike bloqueia se não houver um User-Agent explícito na aba e um Referer confiável
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

      await page.setExtraHTTPHeaders({
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.google.com/'
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

      // Na Nike, use 'networkidle2' na primeira tentativa. 
      // O 'domcontentloaded' é rápido demais e não dá tempo do desafio da Akamai carregar os cookies.
      await page.goto(cleanUrl, {
        waitUntil: 'networkidle2',
        timeout: 45000
      });

      let pageTitle = await page.title();

      if (pageTitle.includes('Access Denied') || pageTitle.includes('Denied') || pageTitle.includes('Just a moment')) {
        console.log('[Nike] Bloqueio detectado. Executando evasão...');

        await Promise.all([
          page.mouse.move(300 + Math.random() * 100, 400 + Math.random() * 100),
          page.evaluate(() => window.scrollBy(0, 300))
        ]);

        await new Promise(r => setTimeout(r, 1500)); // Nike exige um pouco mais de "paciência"

        await page.reload({ waitUntil: 'networkidle2' });

        pageTitle = await page.title();
        if (pageTitle.includes('Access Denied')) {
          throw new Error('Bloqueio persistente na Nike. Verifique seu IP.');
        }
      }

      const productData = await page.evaluate(extractNikeProductData);
      return { ...productData, url: cleanUrl };

    } catch (error) {
      console.error(`[Nike Scraper Error]: ${error.message}`);
      throw error;
    } finally {
      if (page) {
        await page.close().catch(() => { });
      }
    }
  }
}

module.exports = new ExtractNikeService();