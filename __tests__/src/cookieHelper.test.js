const { validateAndParseCookies } = require('../../src/utils/cookieHelper');

describe('Cookie Helper Utility', () => {
  const mockValidContent =
    "# Netscape HTTP Cookie File\n" +
    ".mercadolivre.com.br\tTRUE\t/\tTRUE\t1804805183\t_d2id\teyJpZ...\n" +
    "www.mercadolivre.com.br\tFALSE\t/\tFALSE\t1802435793\ttooltip\ttrue";

  const mockInvalidContent = `This is not a valid cookie file`;

  const mockNoIdentity =
    "# Netscape HTTP Cookie File\n" +
    "www.mercadolivre.com.br\tFALSE\t/\tFALSE\t1802435793\ttooltip\ttrue";

  test('Must convert Netscape text to Puppeteer compatible JSON Array', () => {
    const cookies = validateAndParseCookies(mockValidContent);
    expect(cookies).toBeInstanceOf(Array);
    expect(cookies.length).toBe(2);
    expect(cookies[0].domain).toBe('.mercadolivre.com.br');
    expect(cookies[0].name).toBe('_d2id');
  });

  test('Must reject cookies without identity tokens', () => {
    expect(() => validateAndParseCookies(mockNoIdentity))
      .toThrow('The file does not contain valid session cookies');
  });

  test('Must reject text that does not have a valid format', () => {
    expect(() => validateAndParseCookies(mockInvalidContent))
      .toThrow('Invalid format.');
  });
});