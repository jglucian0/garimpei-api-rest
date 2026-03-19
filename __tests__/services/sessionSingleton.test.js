const sessionSingleton = require('../../src/services/sessionSingleton');

jest.setTimeout(15000);

describe('Session Singleton Test (Puppeteer)', () => {
  afterAll(async () => {
    await sessionSingleton.closeBrowser();
  });

  test('Must ensure that only one browser instance is created (Singleton)', async () => {
    const browser1 = await sessionSingleton.initBrowser();
    const browser2 = await sessionSingleton.initBrowser();

    expect(browser1).toBe(browser2);
    expect(browser1.isConnected()).toBe(true);
  });

  test('It should open a tab, inject the User-Agent and keep the browser alive when closing the tab', async () => {
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
