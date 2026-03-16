function parseCookieHeader(cookieString) {
  if (!cookieString || typeof cookieString !== 'string') {
    throw new Error('Invalid cookie format.');
  }

  const cookies = cookieString
    .split(';')
    .map(c => c.trim())
    .filter(Boolean)
    .map(pair => {
      const [name, ...rest] = pair.split('=');
      const value = rest.join('=');

      return {
        name,
        value,
        domain: '.mercadolivre.com.br',
        path: '/',
        secure: true,
        httpOnly: false,
        expires: -1
      };
    });

  if (!cookies.length) {
    throw new Error('No cookies were detected.');
  }

  const hasSSID = cookies.some(c => c.name === 'ssid');

  if (!hasSSID) {
    throw new Error('Cookie does not contain ssid (not logged session).');
  }

  return cookies;
}

module.exports = { parseCookieHeader };