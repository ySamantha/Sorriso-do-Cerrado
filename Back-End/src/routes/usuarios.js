import express from 'express';
import conexao from '../database/conexao.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { autenticar } from '../middleware/authMiddleware.js';

const router = express.Router();
const secret = process.env.JWT_SECRET || 'segredo';

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [usuarios] = await conexao.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (!usuarios.length) {
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    const usuario = usuarios[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        papel: usuario.papel
      },
      secret,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
});

router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const [emailExistente] = await conexao.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (emailExistente.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const [result] = await conexao.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
      [nome, email, hashSenha, 'cliente']
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      email,
      papel: 'cliente'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

router.put('/me', autenticar, async (req, res) => {
  const { nome, email } = req.body;

  try {
    const userId = req.usuario.id;

    const [userExists] = await conexao.query(
      'SELECT id FROM usuarios WHERE id = ?',
      [userId]
    );

    if (!userExists.length) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await conexao.query(
      'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
      [nome, email, userId]
    );

    res.json({ message: 'Dados atualizados com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar dados' });
  }
});

router.put('/mudar-senha', autenticar, async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;

  try {
    const userId = req.usuario.id;

    const [usuarios] = await conexao.query(
      'SELECT * FROM usuarios WHERE id = ?',
      [userId]
    );

    if (!usuarios.length) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await conexao.query(
      'UPDATE usuarios SET senha = ? WHERE id = ?',
      [novaSenhaHash, userId]
    );

    res.json({ message: 'Senha alterada com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao alterar senha' });
  }
});

export default router;