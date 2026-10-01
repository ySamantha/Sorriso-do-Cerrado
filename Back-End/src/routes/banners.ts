import { Router } from 'express';
import {
  listarBanners,
  listarBannersAtivos,
  criarBanner,
  deletarBanner
} from '../controllers/bannerController.js';
import { autenticar, autorizar } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listarBanners);
router.get('/ativos', listarBannersAtivos);
router.post('/', autenticar, autorizar('admin'), criarBanner);
router.delete('/:id', autenticar, autorizar('admin'), deletarBanner);

export default router;