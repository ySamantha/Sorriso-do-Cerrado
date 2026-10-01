import { Request } from 'express';

export interface UsuarioPayload {
  id: number;
  email: string;
  tipo: 'admin' | 'artesa' | 'cliente';
}

declare global {
  namespace Express {
    interface Request {
      user?: UsuarioPayload;
    }
  }
}