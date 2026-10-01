import type { Request, Response } from 'express';
import ProdutoModel from '../models/produtoModel.js';

export const listarProdutos = async (req: Request, res: Response) => {
  try {
    const produtos = await ProdutoModel.listarTodos();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

export const buscarProdutoPorId = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const produto = await ProdutoModel.buscarPorId(id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

export const criarProduto = async (req: Request, res: Response) => {
  try {
    const { nome, descricao, preco, estoque, imagemURL } = req.body;
    const novoProduto = await ProdutoModel.criar({
      nome,
      descricao,
      preco,
      estoque,
      imagemURL
    });
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

export const atualizarProduto = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { nome, descricao, preco, estoque, imagemURL } = req.body;
    const atualizado = await ProdutoModel.atualizar(id, {
      nome,
      descricao,
      preco,
      estoque,
      imagemURL
    });

    if (!atualizado) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

export const deletarProduto = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deletado = await ProdutoModel.deletar(id);
    if (!deletado) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};