function validarEmail(email) {
  return email.includes('@') && email.includes('.');
}

module.exports = validarEmail;