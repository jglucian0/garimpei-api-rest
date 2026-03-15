const scraperService = require('../../src/services/mercado_livre/extractMercadoLivreService');
const userConfigRepository = require('../../src/repositories/userConfigRepository');
const urlResolutionService = require('../../src/services/urlResolutionService');
const sessionSingleton = require('../../src/services/sessionSingleton');

jest.mock('../../src/repositories/userConfigRepository');
jest.mock('../../src/services/urlResolutionService');

describe('Scraper Service - Unit Tests', () => {

  let mockPage;
  let mockContext;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.clearAllMocks();

    mockPage = {
      setRequestInterception: jest.fn().mockResolvedValue(true),
      on: jest.fn(),
      setUserAgent: jest.fn().mockResolvedValue(true),
      setCookie: jest.fn().mockResolvedValue(true),
      goto: jest.fn().mockResolvedValue(true),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Product Test',
        currentPriceValue: 100.50
      })
    };

    mockContext = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(true)
    };

    sessionSingleton.browser = {
      createBrowserContext: jest.fn().mockResolvedValue(mockContext)
    };

  });

  test('Must extract product data successfully (happy path)', async () => {

    urlResolutionService.resolveFinalUrl.mockResolvedValue(
      'https://produto.mercadolivre.com.br/MLB-123'
    );

    userConfigRepository.getUserCookies.mockResolvedValue([
      { name: 'ssid', value: '12345' }
    ]);

    const result = await scraperService.fetchProduct(
      'https://meli.la/curto',
      'user_123'
    );

    expect(urlResolutionService.resolveFinalUrl)
      .toHaveBeenCalledWith('https://meli.la/curto');

    expect(userConfigRepository.getUserCookies)
      .toHaveBeenCalledWith('user_123');

    expect(sessionSingleton.browser.createBrowserContext)
      .toHaveBeenCalled();

    expect(mockContext.newPage)
      .toHaveBeenCalled();

    expect(mockPage.setCookie)
      .toHaveBeenCalledWith({ name: 'ssid', value: '12345' });

    expect(mockPage.goto)
      .toHaveBeenCalledWith(
        'https://produto.mercadolivre.com.br/MLB-123',
        expect.any(Object)
      );

    expect(mockPage.evaluate)
      .toHaveBeenCalled();

    expect(mockContext.close)
      .toHaveBeenCalled();

    expect(result).toEqual({
      title: 'Product Test',
      currentPriceValue: 100.50
    });

  });

  test('Should throw error if cookies are missing', async () => {

    urlResolutionService.resolveFinalUrl.mockResolvedValue(
      'https://produto.ml/MLB-123'
    );

    userConfigRepository.getUserCookies.mockResolvedValue([]);

    await expect(
      scraperService.fetchProduct('https://link.com', 'user_sem_cookie')
    ).rejects.toThrow('COOKIES_NOT_FOUND');

    expect(sessionSingleton.browser.createBrowserContext)
      .not.toHaveBeenCalled();

  });

  test('Must close context even if navigation fails', async () => {

    urlResolutionService.resolveFinalUrl.mockResolvedValue(
      'https://produto.ml/MLB-123'
    );

    userConfigRepository.getUserCookies.mockResolvedValue([
      { name: 'ssid', value: '123' }
    ]);

    mockPage.goto.mockRejectedValue(new Error('Navigation timeout'));

    await expect(
      scraperService.fetchProduct('https://link.com', 'user_123')
    ).rejects.toThrow('Navigation timeout');

    expect(mockContext.close).toHaveBeenCalled();

  });

});