import express from 'express';
import conexao from '../database/conexao.js';
import { autenticar } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', autenticar, async (req, res) => {
    const { nome_cliente, email_cliente, telefone_cliente, itens } = req.body;
  
    if (!itens || !Array.isArray(itens) || itens.length === 0)
      return res.status(400).json({ error: 'Itens da venda são obrigatórios' });
  
    try {
      let total = 0;
      for (const item of itens) {
        const [[produto]] = await conexao.query('SELECT preco, estoque FROM produtos WHERE id = ?', [item.id_produto]);
        if (!produto) return res.status(400).json({ error: `Produto com ID ${item.id_produto} não encontrado` });
        if (produto.estoque < item.quantidade) return res.status(400).json({ error: `Estoque insuficiente para produto ID ${item.id_produto}` });
        total += produto.preco * item.quantidade;
      }
  
      const [vendaResult] = await conexao.query(
        'INSERT INTO vendas (nome_cliente, email_cliente, telefone_cliente, total) VALUES (?, ?, ?, ?)',
        [nome_cliente, email_cliente, telefone_cliente, total]
      );
  
      const vendaId = vendaResult.insertId;
  
      for (const item of itens) {
        const [[produto]] = await conexao.query('SELECT preco FROM produtos WHERE id = ?', [item.id_produto]);
  
        await conexao.query(
          'INSERT INTO itens_venda (id_venda, id_produto, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
          [vendaId, item.id_produto, item.quantidade, produto.preco]
        );
  
        await conexao.query(
          'UPDATE produtos SET estoque = estoque - ? WHERE id = ?',
          [item.quantidade, item.id_produto]
        );
      }
  
      res.status(201).json({ message: 'Venda registrada com sucesso', vendaId, total });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar venda', detalhes: error.message });
    }
});
  

router.get('/', autenticar, async (req, res) => {
  try {
    const [vendas] = await conexao.query('SELECT * FROM vendas');
    res.json(vendas);
  } catch {
    res.status(500).json({ error: 'Erro ao listar vendas' });
  }
});

router.get('/:id', autenticar, async (req, res) => {
  const { id } = req.params;
  try {
    const [[venda]] = await conexao.query('SELECT * FROM vendas WHERE id = ?', [id]);
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });

    const [itens] = await conexao.query(
      `SELECT iv.*, p.nome FROM itens_venda iv 
       JOIN produtos p ON iv.id_produto = p.id 
       WHERE iv.id_venda = ?`,
      [id]
    );

    res.json({ venda, itens });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar venda' });
  }
});

router.put('/:id/status', autenticar, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pendente', 'confirmada', 'cancelada'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido' });
  }

  try {
    const [result] = await conexao.query(
      'UPDATE vendas SET status = ? WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Venda não encontrada' });

    res.json({ message: 'Status da venda atualizado' });
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar status da venda' });
  }
});

export default router;
