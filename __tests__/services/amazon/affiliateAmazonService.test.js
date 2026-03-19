const affiliateAmazonService = require('../../../src/services/amazon/affiliateAmazonService');
const userConfigRepository = require('../../../src/repositories/userConfigRepository');
const shortLinkRepository = require('../../../src/repositories/shortLinkRepository');
const crypto = require('crypto');

jest.mock('../../../src/repositories/userConfigRepository');
jest.mock('../../../src/repositories/shortLinkRepository');
jest.mock('crypto');

describe('AffiliateAmazonService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a short link and save in the database', async () => {
    userConfigRepository.getUserConfigs.mockResolvedValue({ tag: 'ogarimpei-20' });

    crypto.randomBytes.mockReturnValue({
      toString: () => 'aB3x9Q'
    });

    shortLinkRepository.saveLink.mockResolvedValue(true);

    const asin = 'B0BTYCRJSS';
    const userId = 'garimpei_user_01';

    const result = await affiliateAmazonService.generateAffiliateLink(asin, userId);

    expect(userConfigRepository.getUserConfigs).toHaveBeenCalledWith(userId, 'AMAZON');
    expect(shortLinkRepository.saveLink).toHaveBeenCalledWith(
      'aB3x9Q',
      'https://www.amazon.com.br/dp/B0BTYCRJSS?tag=ogarimpei-20',
      userId
    );
    expect(result).toContain('/s/aB3x9Q');
  });

  it('should throw an error if the user has not configured the Amazon tag', async () => {
    userConfigRepository.getUserConfigs.mockResolvedValue(null);

    await expect(
      affiliateAmazonService.generateAffiliateLink('B0BTYCRJSS', 'user1')
    ).rejects.toThrow('AMAZON_TAG_NOT_FOUND');
  });
});
