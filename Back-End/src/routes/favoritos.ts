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

    const { produto_id } = req.body;

    await FavoritoModel.adicionar(req.usuario.id, Number(produto_id));

    res.status(201).json({ message: 'Favorito adicionado' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar favorito' });
  }
});

router.delete(
  '/:produto_id',
  autenticar,
  async (req: RequisicaoAutenticada, res: Response) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const produtoId = Array.isArray(req.params.produto_id)
        ? req.params.produto_id[0]
        : req.params.produto_id;

      await FavoritoModel.remover(
        req.usuario.id,
        Number(produtoId)
      );

      res.json({ message: 'Favorito removido' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao remover favorito' });
    }
  }
);

export default router;