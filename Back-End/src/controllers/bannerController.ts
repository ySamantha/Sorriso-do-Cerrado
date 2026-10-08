import type { Request, Response } from 'express';

import BannerModel, { type Banner } from '../models/bannerModel.js';

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
    let { titulo, imagemURL, link, ordem } = req.body;

    if (req.file) {
      imagemURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (!imagemURL) {
      return res.status(400).json({ error: 'Imagem é obrigatória para criar o banner' });
    }

    const novoBanner = await BannerModel.criar({
      titulo,
      imagemURL,
      link,
      ordem: ordem ? Number(ordem) : 0,
    });

    res.status(201).json(novoBanner);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar banner' });
  }
};

export const atualizarBanner = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    let { titulo, imagemURL, link, ordem, ativo } = req.body;

    if (req.file) {
      imagemURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const dadosParaAtualizar: Partial<Banner> = {};
    if (titulo !== undefined) dadosParaAtualizar.titulo = titulo;
    if (imagemURL !== undefined) dadosParaAtualizar.imagemURL = imagemURL;
    if (link !== undefined) dadosParaAtualizar.link = link;
    if (ordem !== undefined) dadosParaAtualizar.ordem = Number(ordem);
    if (ativo !== undefined) dadosParaAtualizar.ativo = ativo === 'true' || ativo === true;

    if (Object.keys(dadosParaAtualizar).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para atualização' });
    }

    const atualizado = await BannerModel.atualizar(id, dadosParaAtualizar);

    if (!atualizado) {
      return res.status(404).json({ error: 'Banner não encontrado' });
    }

    const bannerAtualizado = await BannerModel.buscarPorId(id);
    res.json({ message: 'Banner atualizado com sucesso', banner: bannerAtualizado });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar banner' });
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