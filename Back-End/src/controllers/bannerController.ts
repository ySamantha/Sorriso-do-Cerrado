import type { Request, Response } from 'express';

import BannerModel from '../models/bannerModel.js';

export const listarBanners = async (req: Request, res: Response) => {
  try {
    const banners = await BannerModel.listarTodos();

    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar banners' });
  }
};

export const listarBannersAtivos = async (req: Request, res: Response) => {
  try {
    const banners = await BannerModel.listarAtivos();

    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar banners ativos' });
  }
};

export const criarBanner = async (req: Request, res: Response) => {
  try {
    const { titulo, imagemURL, link, ordem } = req.body;

    const novoBanner = await BannerModel.criar({
      titulo,
      imagemURL,
      link,
      ordem,
    });

    res.status(201).json(novoBanner);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar banner' });
  }
};

export const deletarBanner = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const deletado = await BannerModel.deletar(id);

    if (!deletado) {
      return res.status(404).json({ error: 'Banner não encontrado' });
    }

    res.json({ message: 'Banner deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar banner' });
  }
};