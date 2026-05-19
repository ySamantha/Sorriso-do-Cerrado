import conexao from '../database/conexao.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'segredo';

export const criarUsuario = async (req, res) => {
  const { nome, email, senha, papel } = req.body;
  try {
    const [userExists] = await conexao.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (userExists.length) return res.status(409).json({ error: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);
    const [result] = await conexao.query(
      'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
      [nome, email, hash, papel || 'artesa']
    );

    res.status(201).json({ id: result.insertId, nome, email, papel: papel || 'artesa' });
  } catch {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const loginUsuario = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await conexao.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Credenciais inválidas' });

    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, papel: user.papel }, secret, { expiresIn: '8h' });
    res.json({ token, nome: user.nome, papel: user.papel });
  } catch {
    res.status(500).json({ error: 'Erro no login' });
  }
};

export const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await conexao.query('SELECT id, nome, email, papel FROM usuarios');
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
};

export const deletarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await conexao.query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json({ mensagem: 'Usuário deletado' });
  } catch {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};
