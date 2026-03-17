const extractAmazonService = require('../../../src/services/amazon/extractAmazonService');
const sessionSingleton = require('../../../src/services/sessionSingleton');
const urlResolutionService = require('../../../src/services/urlResolutionService');

jest.mock('../../../src/services/sessionSingleton');
jest.mock('../../../src/services/urlResolutionService');

describe('ExtractAmazonService', () => {
  let mockPage;
  let mockContext;
  let mockBrowser;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPage = {
      setUserAgent: jest.fn(),
      goto: jest.fn().mockResolvedValue(true),
      evaluate: jest.fn().mockResolvedValue({
        title: 'Fone Bluetooth Mockado',
        currentPriceValue: 150.00,
        oldPriceValue: 200.00,
        discountPercent: 25,
        imageUrl: 'http://img.mock/1.jpg',
        shipping: true,
        soldQuantity: '+ 1 mil compras',
        couponApplied: false
      }),
    };

    mockContext = {
      newPage: jest.fn().mockResolvedValue(mockPage),
      close: jest.fn().mockResolvedValue(true),
    };

    mockBrowser = {
      createBrowserContext: jest.fn().mockResolvedValue(mockContext),
    };

    sessionSingleton.initBrowser.mockResolvedValue(mockBrowser);
  });

  it('must extract the ASIN from a long URL and return the mocked product data', async () => {
    const mockUrl = 'https://www.amazon.com.br/soundcore-Bluetooth/dp/B0BTYCRJSS/';
    urlResolutionService.resolveFinalUrl.mockResolvedValue(mockUrl);

    const result = await extractAmazonService.fetchProduct(mockUrl);

    expect(urlResolutionService.resolveFinalUrl).toHaveBeenCalledWith(mockUrl);
    expect(result.asin).toBe('B0BTYCRJSS');
    expect(result.url).toBe('https://www.amazon.com.br/dp/B0BTYCRJSS');

    expect(result.title).toBe('Fone Bluetooth Mockado');
    expect(mockPage.goto).toHaveBeenCalledWith('https://www.amazon.com.br/dp/B0BTYCRJSS', expect.any(Object));
    expect(mockContext.close).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if the URL does not contain a valid ASIN', async () => {
    urlResolutionService.resolveFinalUrl.mockResolvedValue('https://www.amazon.com.br/home');

    await expect(extractAmazonService.fetchProduct('https://www.amazon.com.br/home'))
      .rejects
      .toThrow("The ASIN could not be found in the Amazon link. Make sure it's a valid product link.");
  });
});