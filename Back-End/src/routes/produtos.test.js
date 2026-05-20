import ProdutoController from '../controllers/produtoController.js';
import ProdutoModel from '../models/produtoModel.js';

jest.mock('../models/produtoModel.js', () => ({
  criar: jest.fn()
}));

describe('CT-002 - Validação de preço positivo no produto', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('Deve aceitar o produto quando o preço for estritamente positivo', async () => {
    req.body = { nome: "Vaso de Barro", preco: 45.00 };
    ProdutoModel.criar.mockResolvedValue({ id: 1, ...req.body });

    await ProdutoController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('Deve recusar o produto quando o preço for igual a zero', async () => {
    req.body = { nome: "Vaso de Barro", preco: 0.00 };

    await ProdutoController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "O preço deve ser maior que zero." });
  });

  test('Deve recusar o produto quando o preço for negativo', async () => {
    req.body = { nome: "Vaso de Barro", preco: -19.90 };

    await ProdutoController.criar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "O preço deve ser maior que zero." });
  });
});