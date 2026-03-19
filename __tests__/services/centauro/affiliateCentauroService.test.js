const affiliateCentauroService = require('../../../src/services/centauro/affiliateCentauroService');
const userConfigRepository = require('../../../src/repositories/userConfigRepository');
const shortLinkRepository = require('../../../src/repositories/shortLinkRepository');
const crypto = require('crypto');

jest.mock('../../../src/repositories/userConfigRepository');
jest.mock('../../../src/repositories/shortLinkRepository');
jest.mock('crypto');

describe('AffiliateCentauroService', () => {
  const mockUserId = 'garimpei_user_01';
  const mockProductUrl = 'https://www.centauro.com.br/tenis';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.APP_URL = 'http://localhost:3001';
  });

  it('must generate a new short link if it does not exist in the database', async () => {
    userConfigRepository.getUserConfigs.mockResolvedValue({ tag: '2815810' });
    shortLinkRepository.getExistingCode.mockResolvedValue(null);
    crypto.randomBytes.mockReturnValue({ toString: () => 'abc123' });

    const result = await affiliateCentauroService.generateAffiliateLink(mockProductUrl, mockUserId);

    expect(userConfigRepository.getUserConfigs).toHaveBeenCalledWith(mockUserId, 'AWIN');
    expect(shortLinkRepository.saveLink).toHaveBeenCalledWith(
      'abc123',
      expect.stringContaining('awinmid=17806'),
      mockUserId
    );
    expect(result).toBe('http://localhost:3001/s/abc123');
  });

  it('must return the existing link if it is already in the database', async () => {
    userConfigRepository.getUserConfigs.mockResolvedValue({ tag: '2815810' });
    shortLinkRepository.getExistingCode.mockResolvedValue('xyz987');

    const result = await affiliateCentauroService.generateAffiliateLink(mockProductUrl, mockUserId);

    expect(shortLinkRepository.saveLink).not.toHaveBeenCalled();
    expect(result).toBe('http://localhost:3001/s/xyz987');
  });

  it('should throw an error if the user does not have the AWIN tag', async () => {
    userConfigRepository.getUserConfigs.mockResolvedValue(null);

    await expect(
      affiliateCentauroService.generateAffiliateLink(mockProductUrl, mockUserId)
    ).rejects.toThrow('AWIN_TAG_NOT_FOUND');
  });
});
