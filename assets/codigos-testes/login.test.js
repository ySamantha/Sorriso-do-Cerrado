function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  } catch {
    return null;
  }
}

function isAdmin(token) {
  const payload = parseJwt(token);
  return payload?.papel === 'admin';
}

test('CT004 - deve identificar usuário admin pelo token', () => {
  const payload = Buffer.from(JSON.stringify({ papel: 'admin' })).toString('base64');

  const fakeToken = `header.${payload}.signature`;

  expect(isAdmin(fakeToken)).toBe(true);
});

test('CT005 - deve rejeitar usuário não admin', () => {
  const payload = Buffer.from(JSON.stringify({ papel: 'cliente' })).toString('base64');

  const fakeToken = `header.${payload}.signature`;

  expect(isAdmin(fakeToken)).toBe(false);
});