const sessionSingleton = require('./sessionSingleton');

class CookieValidatorService {

  async verifySessionActive(cookies) {
    if (!cookies || !cookies.length) return false;

    let context;
    let page;
    try {
      context = await sessionSingleton.browser.createBrowserContext();
      page = await context.newPage();

      await page.goto('https://www.mercadolivre.com.br', {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      await page.setCookie(...cookies);

      await page.goto('https://www.mercadolivre.com.br/afiliados/hub#menu-user', {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });

      const finalUrl = page.url();

      if (finalUrl.includes('login') || finalUrl.includes('registration') || !finalUrl.includes('afiliados')) {
        return false;
      }

      return true;

    } catch (error) {
      console.error('[CookieValidator] Network error when testing cookies:', error.message);
      return false;
    } finally {
      if (context) {
        await context.close().catch(() => { });
      }
    }
  }
}

module.exports = new CookieValidatorService();