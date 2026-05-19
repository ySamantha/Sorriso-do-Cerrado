import conexao from '../database/conexao.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'segredo';

export const criarUsuario = async (req, res) => {
  const { nome, email, senha, papel } = req.body;

  try {
    const [userExists] = await conexao.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (userExists.length) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);

    await conexao.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
      [nome, email, hash, papel || 'cliente']
    );

    res.status(201).json({ message: 'Usuário criado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await conexao.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = rows[0];

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
      papel: user.papel
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro no login' });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await conexao.query(
      'SELECT id, nome, email, papel FROM usuarios'
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

export const atualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;

  try {
    const [rows] = await conexao.query(
      'SELECT papel FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    const logado = rows[0];

    const isOwner = req.usuario.id == id;
    const isAdmin = logado.papel === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await conexao.query(
      'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
      [nome, email, id]
    );

    res.json({ message: 'Usuário atualizado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

export const deletarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await conexao.query(
      'SELECT papel FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    const logado = rows[0];

    if (logado.papel !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const [result] = await conexao.query(
      'DELETE FROM usuarios WHERE id = ?',
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário deletado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};