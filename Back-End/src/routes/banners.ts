import { Router } from 'express';
import {
  listarBanners,
  listarBannersAtivos,
  criarBanner,
  atualizarBanner,
  deletarBanner
} from '../controllers/bannerController.js';
import { autenticar, autorizar } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/', listarBanners);
router.get('/ativos', listarBannersAtivos);
router.post('/', autenticar, autorizar('admin'), upload.single('imagem'), criarBanner);
router.put('/:id', autenticar, autorizar('admin'), upload.single('imagem'), atualizarBanner);
router.delete('/:id', autenticar, autorizar('admin'), deletarBanner);

export default router;