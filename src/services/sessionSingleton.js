const puppeteer = require('puppeteer');

class SessionSingleton {
  constructor() {
    if (!SessionSingleton.instance) {
      this.browser = null;
      SessionSingleton.instance = this;
    }
    return SessionSingleton.instance;
  }

  async initBrowser() {
    if (!this.browser) {
      console.log('[Puppeteer] Starting broenser...');
      this.browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      this.browser.on('disconnected', () => {
        console.log('[Puppeteer] Browser disconnected. Resetting variable...');
        this.browser = null;
      });
    }
    return this.browser;
  }

  async getPage() {
    if (!this.browser) {
      await this.initBrowser();
    }

    const page = await this.browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );

    await page.setRequestInterception(true);
    page.on('request', req => {
      const allowerdResources = ['document', 'xhr', 'fetch', 'script', 'stylesheet'];

      if (!allowerdResources.includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
    return page;
  }

  async closeBrowser() {
    if (this.browser) {
      console.log('[Puppeteer] Quitting browser safely...');
      await this.browser.close();
      this.browser = null;
    }
  }
}

module.exports = new SessionSingleton();
