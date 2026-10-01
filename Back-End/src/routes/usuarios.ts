import { Router } from 'express';
import {
  criarUsuario,
  loginUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario
} from '../controllers/usuarioController.js';
import { autenticar, autorizar } from '../middleware/authMiddleware.js';
import type { RequisicaoAutenticada } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', criarUsuario);
router.post('/login', loginUsuario);
router.get('/', autenticar, autorizar('admin'), listarUsuarios);

router.put('/me', autenticar, (req, res) => {
  req.params.id = String((req as RequisicaoAutenticada).usuario?.id);
  return atualizarUsuario(req, res);
});

router.put('/:id', autenticar, atualizarUsuario);

router.delete('/:id', autenticar, autorizar('admin'), deletarUsuario);

export default router;