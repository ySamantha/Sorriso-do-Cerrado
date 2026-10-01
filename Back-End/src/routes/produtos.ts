import { Router } from 'express';
import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
} from '../controllers/produtoController.js';
import { autenticar, autorizar } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listarProdutos);
router.get('/:id', buscarProdutoPorId);
router.post('/', autenticar, autorizar('admin'), criarProduto);
router.put('/:id', autenticar, autorizar('admin'), atualizarProduto);
router.delete('/:id', autenticar, autorizar('admin'), deletarProduto);

export default router;