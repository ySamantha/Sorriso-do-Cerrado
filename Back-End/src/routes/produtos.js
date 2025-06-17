import express from 'express';
import conexao from '../database/conexao.js';
import { autenticar, autorizar } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [produtos] = await conexao.query('SELECT * FROM produtos');
    res.json(produtos);
  } catch {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [produtos] = await conexao.query('SELECT * FROM produtos WHERE id = ?', [id]);
    if (produtos.length === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(produtos[0]);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

router.post('/', autenticar, autorizar('artesa', 'admin'), async (req, res) => {
  const { nome, descricao, preco, estoque, imagemURL } = req.body;
  try {
    const [result] = await conexao.query(
      'INSERT INTO produtos (nome, descricao, preco, estoque, imagemURL) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, preco, estoque, imagemURL]
    );
    res.status(201).json({ id: result.insertId, nome, descricao, preco, estoque, imagemURL });
  } catch {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

router.put('/:id', autenticar, autorizar('artesa', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, estoque, imagemURL } = req.body;
  try {
    const [result] = await conexao.query(
      'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, imagemURL = ? WHERE id = ?',
      [nome, descricao, preco, estoque, imagemURL, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ id, nome, descricao, preco, estoque, imagemURL });
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

router.delete('/:id', autenticar, autorizar('artesa', 'admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await conexao.query('DELETE FROM itens_venda WHERE id_produto = ?', [id]);
    const [result] = await conexao.query('DELETE FROM produtos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ message: 'Produto deletado com sucesso' });
  } catch {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
});

export default router;
