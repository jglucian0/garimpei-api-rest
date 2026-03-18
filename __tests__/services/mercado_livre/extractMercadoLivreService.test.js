const scraperService = require('../../../src/services/mercado_livre/extractMercadoLivreService');
const userConfigRepository = require('../../../src/repositories/userConfigRepository');
const urlResolutionService = require('../../../src/services/urlResolutionService');
const sessionSingleton = require('../../../src/services/sessionSingleton');

jest.mock('../../../src/repositories/userConfigRepository');
jest.mock('../../../src/services/urlResolutionService');
jest.mock('../../../src/services/sessionSingleton');

describe('Scraper Service - Unit Tests', () => {

  let mockPage;
  let mockContext;
  let mockBrowser;

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

    mockBrowser = {
      createBrowserContext: jest.fn().mockResolvedValue(mockContext)
    };

    sessionSingleton.initBrowser.mockResolvedValue(mockBrowser);
  });

  test('Must extract product data successfully (happy path)', async () => {
    urlResolutionService.resolveFinalUrl.mockResolvedValue(
      'https://produto.mercadolivre.com.br/MLB-123'
    );

    userConfigRepository.getUserConfigs.mockResolvedValue({
      cookies: [{ name: 'ssid', value: '12345' }],
      tag: 'minha_tag_teste'
    });

    const result = await scraperService.fetchProduct(
      'https://meli.la/curto',
      {
        userId: 'user_123',
        marketplace: 'ML'
      }
    );

    expect(urlResolutionService.resolveFinalUrl).toHaveBeenCalledWith('https://meli.la/curto');
    expect(userConfigRepository.getUserConfigs).toHaveBeenCalledWith(
      { userId: 'user_123', marketplace: 'ML' },
      'ML'
    );
    expect(sessionSingleton.initBrowser).toHaveBeenCalled();
    expect(mockBrowser.createBrowserContext).toHaveBeenCalled();
    expect(mockContext.newPage).toHaveBeenCalled();
    expect(mockPage.setCookie).toHaveBeenCalledWith({ name: 'ssid', value: '12345' });

    expect(mockPage.goto).toHaveBeenCalledWith(
      'https://produto.mercadolivre.com.br/MLB-123',
      expect.any(Object)
    );

    expect(mockPage.evaluate).toHaveBeenCalled();
    expect(mockContext.close).toHaveBeenCalled();

    expect(result).toEqual({
      title: 'Product Test',
      currentPriceValue: 100.50
    });
  });

  test('Should throw error if cookies are missing', async () => {
    urlResolutionService.resolveFinalUrl.mockResolvedValue(
      'https://produto.ml/MLB-123'
    );

    userConfigRepository.getUserConfigs.mockResolvedValue({ cookies: [] });

    await expect(
      scraperService.fetchProduct(
        'https://link.com',
        { userId: 'user_sem_cookie', marketplace: 'ML' }
      )
    ).rejects.toThrow('COOKIES_NOT_FOUND');

    expect(mockBrowser.createBrowserContext).not.toHaveBeenCalled();
  });

  test('Must close context even if navigation fails', async () => {
    urlResolutionService.resolveFinalUrl.mockResolvedValue(
      'https://produto.ml/MLB-123'
    );

    userConfigRepository.getUserConfigs.mockResolvedValue({
      cookies: [{ name: 'ssid', value: '123' }],
      tag: 'minha_tag_teste'
    });

    mockPage.goto.mockRejectedValue(new Error('Navigation timeout'));

    await expect(
      scraperService.fetchProduct(
        'https://link.com',
        { userId: 'user_123', marketplace: 'ML' }
      )
    ).rejects.toThrow('Navigation timeout');

    expect(mockContext.close).toHaveBeenCalled();
  });

});