import ProdutoModel from '../models/produtoModel.js';

const ProdutoController = {
  listar: async (req, res) => {
    try {
      const produtos = await ProdutoModel.listarTodos();
      res.json(produtos);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
  },

  criar: async (req, res) => {
    try {
      const novoProduto = await ProdutoModel.criar(req.body);
      res.status(201).json(novoProduto);
    } catch (erro) {
      res.status(500).json({ erro: 'Erro ao criar produto' });
    }
  }
};

export default ProdutoController;
