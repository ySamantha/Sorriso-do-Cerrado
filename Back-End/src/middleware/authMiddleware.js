import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'segredo';

export const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret);

    req.usuario = {
      id: decoded.id,
      papel: decoded.papel?.trim().toLowerCase()
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const autorizar = (...papeis) => {
  const papeisNormalizados = papeis.map(p => p.trim().toLowerCase());

  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const papelUsuario = req.usuario.papel?.trim().toLowerCase();

    if (!papeisNormalizados.includes(papelUsuario)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
};