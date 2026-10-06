import { Router } from 'express';
import type { Response } from 'express';
import { autenticar } from '../middleware/authMiddleware.js';
import type { RequisicaoAutenticada } from '../middleware/authMiddleware.js';
import FavoritoModel from '../models/favoritoModel.js';

const router = Router();

router.get('/', autenticar, async (req: RequisicaoAutenticada, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const favoritos = await FavoritoModel.listarPorUsuario(req.usuario.id);

    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar favoritos' });
  }
});

router.post('/', autenticar, async (req: RequisicaoAutenticada, res: Response) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const id_produto = req.body.id_produto ?? req.body.produto_id;

    if (!id_produto || isNaN(Number(id_produto))) {
      return res.status(400).json({ error: 'id_produto é obrigatório e deve ser numérico' });
    }

    await FavoritoModel.adicionar(req.usuario.id, Number(id_produto));

    res.status(201).json({ message: 'Favorito adicionado' });
  } catch (err) {
    console.error('Erro ao adicionar favorito:', err);
    res.status(500).json({ error: 'Erro ao adicionar favorito' });
  }
});

router.delete(
  '/:id_produto',
  autenticar,
  async (req: RequisicaoAutenticada, res: Response) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const paramId = req.params.id_produto ?? req.params.produto_id;
      const id = Array.isArray(paramId) ? paramId[0] : paramId;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'id_produto é obrigatório e deve ser numérico' });
      }

      await FavoritoModel.remover(
        req.usuario.id,
        Number(id)
      );

      res.json({ message: 'Favorito removido' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover favorito' });
    }
  }
);

export default router;