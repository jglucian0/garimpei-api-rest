const extractCentauroService = require('../../../src/services/centauro/extractCentauroService');
const sessionSingleton = require('../../../src/services/sessionSingleton');
const urlResolutionService = require('../../../src/services/urlResolutionService');

jest.mock('../../../src/services/sessionSingleton');
jest.mock('../../../src/services/urlResolutionService');

jest.setTimeout(10000);

describe('ExtractCentauroService', () => {
  let mockPage;
  let mockBrowser;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPage = {
      setViewport: jest.fn(),
      setExtraHTTPHeaders: jest.fn(),
      setUserAgent: jest.fn(),
      setRequestInterception: jest.fn(),
      on: jest.fn(),
      goto: jest.fn(),
      title: jest.fn(),
      evaluate: jest.fn(),
      mouse: { move: jest.fn() },
      reload: jest.fn(),
      close: jest.fn().mockResolvedValue()
    };

    mockBrowser = {
      newPage: jest.fn().mockResolvedValue(mockPage)
    };

    sessionSingleton.initBrowser.mockResolvedValue(mockBrowser);
    urlResolutionService.resolveFinalUrl.mockResolvedValue('https://www.centauro.com.br/tenis');
  });

  it('should extract product data successfully (No Akamai lock)', async () => {
    mockPage.title.mockResolvedValue('Tênis Nike Revolution');
    mockPage.evaluate.mockResolvedValue({
      title: 'Tênis Nike Revolution',
      currentPriceValue: 299.99
    });

    const result = await extractCentauroService.fetchProduct('https://url-curta.com');

    expect(sessionSingleton.initBrowser).toHaveBeenCalled();
    expect(mockPage.goto).toHaveBeenCalledWith('https://www.centauro.com.br/tenis', expect.any(Object));
    expect(mockPage.evaluate).toHaveBeenCalled();
    expect(mockPage.close).toHaveBeenCalled();
    expect(result.currentPriceValue).toBe(299.99);
  });

  it('must perform the evasion and pass if Akamai blocks on the first attempt', async () => {
    mockPage.title
      .mockResolvedValueOnce('Access Denied')
      .mockResolvedValueOnce('Tênis Nike Revolution');

    mockPage.evaluate.mockResolvedValue({
      title: 'Tênis Nike Revolution',
      currentPriceValue: 299.99
    });

    const result = await extractCentauroService.fetchProduct('https://url-curta.com');

    expect(mockPage.reload).toHaveBeenCalled();
    expect(mockPage.mouse.move).toHaveBeenCalled();
    expect(result.currentPriceValue).toBe(299.99);
  });
});