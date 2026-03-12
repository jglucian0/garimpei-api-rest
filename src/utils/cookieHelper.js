function parseCookieLine(line) {
  if (!line.trim() || line.startsWith('#')) return null;

  const parts = line.split('\t');
  if (parts.length < 7) return null;

  return {
    domain: parts[0],
    path: parts[2],
    secure: parts[3] === 'TRUE',
    expires: Number(parts[4]) || -1,
    name: parts[5],
    value: parts[6].trim(),
    httpOnly: false
  };
}

function validateAndParseCookies(content) {
  const cookies = content.split('\n').map(parseCookieLine).filter(Boolean);

  if (!cookies.length) throw new Error('Invalid format.');

  const hasIdentity = cookies.some(c =>
    c.name.includes('sid') || c.name.includes('ssid') || c.name.includes('_d2id') || c.name.includes('auth')
  );

  if (!hasIdentity) {
    throw new Error('The file does not contain valid session cookies (identity tokens are missing).');
  }

  return cookies;
}

module.exports = { validateAndParseCookies };