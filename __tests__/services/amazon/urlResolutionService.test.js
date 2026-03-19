const urlResolutionService = require('../../../src/services/urlResolutionService');
const axios = require('axios');

jest.mock('axios');

describe('UrlResolutionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should follow redirection of short links like amzn.to and a.co', async () => {
    axios.get.mockResolvedValue({
      request: {
        res: {
          responseUrl:
            'https://www.amazon.com.br/soundcore-Bluetooth-Resist%C3%AAncia-Microfones-Personaliz%C3%A1vel/dp/B0BTYCRJSS/ref=sr_1_1'
        }
      },
      config: { url: 'https://amzn.to/4cRA99K' }
    });

    const result = await urlResolutionService.resolveFinalUrl('https://amzn.to/4cRA99K');

    expect(axios.get).toHaveBeenCalledWith('https://amzn.to/4cRA99K', expect.any(Object));
    expect(result).toBe(
      'https://www.amazon.com.br/soundcore-Bluetooth-Resist%C3%AAncia-Microfones-Personaliz%C3%A1vel/dp/B0BTYCRJSS/ref=sr_1_1'
    );
  });
});
