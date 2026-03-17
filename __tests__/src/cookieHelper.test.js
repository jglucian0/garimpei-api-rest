const { parseCookieHeader } = require('../../src/utils/cookieHelper');

describe('Cookie Helper Utility', () => {
  // 1. Mock do formato novo (Raw Cookie String da nossa extensão)
  const mockValidContent = "ssid=meu_token_secreto_aqui; _d2id=abc12345; tooltip=true";

  // 2. Mock sem o SSID (simulando um usuário deslogado)
  const mockNoIdentity = "_d2id=abc12345; tooltip=true";

  // 3. Mocks de dados inválidos
  const mockInvalidType = 12345; // Passando número em vez de string
  const mockEmptyString = "   ;   "; // String vazia/apenas espaços

  test('Must convert raw cookie string to Puppeteer compatible JSON Array', () => {
    const cookies = parseCookieHeader(mockValidContent);

    expect(cookies).toBeInstanceOf(Array);
    expect(cookies.length).toBe(3); // Deve achar ssid, _d2id e tooltip
    expect(cookies[0].domain).toBe('.mercadolivre.com.br');
    expect(cookies[0].name).toBe('ssid');
    expect(cookies[0].value).toBe('meu_token_secreto_aqui');
  });

  test('Must reject cookies without ssid (identity token)', () => {
    expect(() => parseCookieHeader(mockNoIdentity))
      .toThrow('Cookie does not contain ssid (not logged session).');
  });

  test('Must reject invalid data types', () => {
    expect(() => parseCookieHeader(mockInvalidType))
      .toThrow('Invalid cookie format.');
  });

  test('Must reject empty cookies string', () => {
    expect(() => parseCookieHeader(mockEmptyString))
      .toThrow('No cookies were detected.');
  });
});