import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/usuarioModel.js';
import type { RequisicaoAutenticada } from '../middleware/authMiddleware.js';

const secret = process.env.JWT_SECRET || 'segredo';

export const criarUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha, papel } = req.body;

  try {
    const userExists = await UsuarioModel.buscarPorEmail(email);

    if (userExists) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);

    await UsuarioModel.criar({
      nome,
      email,
      senha: hash,
      papel: papel || 'cliente',
    });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const user = await UsuarioModel.buscarPorEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const match = await bcrypt.compare(senha, user.senha);

    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, papel: user.papel },
      secret,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      id: user.id,
      nome: user.nome,
      papel: user.papel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
};

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await UsuarioModel.listarTodos();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

export const atualizarUsuario = async (
  req: RequisicaoAutenticada,
  res: Response
) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const { nome, email } = req.body;

  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const logado = await UsuarioModel.buscarPorId(req.usuario.id);

    const isOwner = String(req.usuario.id) === String(id);
    const isAdmin = logado?.papel === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await UsuarioModel.atualizar(id, { nome, email });

    res.json({ message: 'Usuário atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

export const deletarUsuario = async (
  req: RequisicaoAutenticada,
  res: Response
) => {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const logado = await UsuarioModel.buscarPorId(req.usuario.id);

    if (logado?.papel !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const deletado = await UsuarioModel.deletar(id);

    if (!deletado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};