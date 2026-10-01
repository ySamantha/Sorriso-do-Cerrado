import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'segredo';

export interface UsuarioDecodificado {
  id: number;
  papel: string;
}

export interface RequisicaoAutenticada extends Request {
  usuario?: UsuarioDecodificado;
}

export const autenticar = (
  req: RequisicaoAutenticada,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secret) as UsuarioDecodificado;

    req.usuario = {
      id: decoded.id,
      papel: decoded.papel?.trim().toLowerCase()
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const autorizar = (...papeis: string[]) => {
  const papeisNormalizados = papeis.map(p => p.trim().toLowerCase());

  return (req: RequisicaoAutenticada, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const papelUsuario = req.usuario.papel?.trim().toLowerCase();

    if (!papelUsuario || !papeisNormalizados.includes(papelUsuario)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    next();
  };
};