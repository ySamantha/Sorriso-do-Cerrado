const validarEmail = require('../src/validarEmail');

test('CT001 - deve rejeitar emails inválidos', () => {
  const execucaoA = 'usuario.cerrado.com';
  const execucaoB = 'usuario@cerrado';

  expect(validarEmail(execucaoA)).toBe(false);
  expect(validarEmail(execucaoB)).toBe(false);
});