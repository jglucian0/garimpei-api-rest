const sessionSingleton = require('../../src/services/sessionSingleton');

jest.setTimeout(15000);

describe('Teste do Session Singleton (Puppeteer)', () => {
  afterAll(async () => {
    await sessionSingleton.closeBrowser();
  });

  test('Deve garantir que apenas uma instância do browser seja criada (Singleton)', async () => {
    const browser1 = await sessionSingleton.initBrowser();
    const browser2 = await sessionSingleton.initBrowser();

    expect(browser1).toBe(browser2);
    expect(browser1.isConnected()).toBe(true);
  });

  test('Deve abrir uma aba, injetar o User-Agent e manter o browser vivo ao fechar a aba', async () => {
    const page = await sessionSingleton.getPage();
    expect(page).toBeDefined();
    expect(page.isClosed()).toBe(false);

    const userAgentInBrowser = await page.evaluate(() => navigator.userAgent);
    expect(userAgentInBrowser).toBe(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
    );

    await page.close();
    expect(page.isClosed()).toBe(true);

    expect(sessionSingleton.browser).not.toBeNull();
    expect(sessionSingleton.browser.isConnected()).toBe(true);
  });
});