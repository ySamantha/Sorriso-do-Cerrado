import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'segredo';

export const autenticar = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token inválido' });

  try {
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const autorizar = (...papeisPermitidos) => (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ error: 'Usuário não autenticado' });
  if (papeisPermitidos.length > 0 && !papeisPermitidos.includes(req.usuario.papel)) {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};
