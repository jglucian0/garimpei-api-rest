const extractNikeService = require('../../../src/services/nike/extractNikeService');
const sessionSingleton = require('../../../src/services/sessionSingleton');
const urlResolutionService = require('../../../src/services/urlResolutionService');

jest.mock('../../../src/services/sessionSingleton');
jest.mock('../../../src/services/urlResolutionService');

jest.setTimeout(10000);

describe('ExtractNikeService', () => {
  let mockPage;
  let mockBrowser;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPage = {
      setViewport: jest.fn(),
      setExtraHTTPHeaders: jest.fn(),
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
    urlResolutionService.resolveFinalUrl.mockResolvedValue('https://www.nike.com.br/tenis');
  });

  it('must extract product data successfully', async () => {
    mockPage.title.mockResolvedValue('Tênis Nike Revolution');
    mockPage.evaluate.mockResolvedValue({
      title: 'Tênis Nike Revolution',
      currentPriceValue: 450.0
    });

    const result = await extractNikeService.fetchProduct('https://nike-curto.com');

    expect(mockPage.goto).toHaveBeenCalledWith('https://www.nike.com.br/tenis', expect.any(Object));
    expect(result.currentPriceValue).toBe(450.0);
  });

  it('should throw error if Akamai block persists', async () => {
    mockPage.title.mockResolvedValue('Access Denied');

    await expect(extractNikeService.fetchProduct('https://nike-curto.com')).rejects.toThrow(
      'Persistent block on Nike. Please try again in a moment.'
    );

    expect(mockPage.reload).toHaveBeenCalled();
    expect(mockPage.close).toHaveBeenCalled();
  });
});
