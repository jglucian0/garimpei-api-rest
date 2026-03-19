const affiliateNikeService = require('../../../src/services/nike/affiliateNikeService');
const userConfigRepository = require('../../../src/repositories/userConfigRepository');
const shortLinkRepository = require('../../../src/repositories/shortLinkRepository');
const crypto = require('crypto');

jest.mock('../../../src/repositories/userConfigRepository');
jest.mock('../../../src/repositories/shortLinkRepository');
jest.mock('crypto');

describe('AffiliateNikeService', () => {
  const mockUserId = 'garimpei_user_01';
  const mockProductUrl = 'https://www.nike.com.br/tenis';

  it('should generate a new short link with Nike specific awinmid', async () => {
    userConfigRepository.getUserConfigs.mockResolvedValue({ tag: '2815810' });
    shortLinkRepository.getExistingCode.mockResolvedValue(null);
    crypto.randomBytes.mockReturnValue({ toString: () => 'nike123' });

    const result = await affiliateNikeService.generateAffiliateLink(mockProductUrl, mockUserId);

    expect(shortLinkRepository.saveLink).toHaveBeenCalledWith(
      'nike123',
      expect.stringContaining('awinmid=17652'),
      mockUserId
    );
    expect(result).toBe('http://localhost:3001/s/nike123');
  });
});
