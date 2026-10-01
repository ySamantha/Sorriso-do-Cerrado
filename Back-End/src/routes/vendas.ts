import { Router } from 'express';
import type { Response } from 'express';
import { autenticar, autorizar } from '../middleware/authMiddleware.js';
import type { RequisicaoAutenticada } from '../middleware/authMiddleware.js';
import VendaModel from '../models/vendaModel.js';

const router = Router();

router.get(
  '/',
  autenticar,
  autorizar('admin'),
  async (req: RequisicaoAutenticada, res: Response) => {
    try {
      const vendas = await VendaModel.listarTodas();

      res.json(vendas);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar vendas' });
    }
  }
);

router.post(
  '/',
  autenticar,
  async (req: RequisicaoAutenticada, res: Response) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const {
        nomeCliente,
        emailCliente,
        telefoneCliente,
        total,
      } = req.body;

      const venda = await VendaModel.criar({
        nomeCliente,
        emailCliente,
        telefoneCliente,
        total,
      });

      res.status(201).json(venda);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao registrar venda' });
    }
  }
);

export default router;