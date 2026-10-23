import type { FastifyReply, FastifyRequest } from "fastify";
import BannerModel, { type Banner } from "../models/bannerModel.js";
import { parseUploadRequest } from "../middleware/uploadRequest.js";

type BannerParams = { id: string };

export const listarBanners = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.send(await BannerModel.listarTodos());
  } catch (error) {
    request.log.error({ err: error }, "Erro ao buscar banners");
    return reply.code(500).send({ error: "Erro ao buscar banners" });
  }
};

export const listarBannersAtivos = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    return reply.send(await BannerModel.listarAtivos());
  } catch (error) {
    request.log.error({ err: error }, "Erro ao buscar banners ativos");
    return reply.code(500).send({ error: "Erro ao buscar banners ativos" });
  }
};

export const criarBanner = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { fields, file } = await parseUploadRequest(request, "imagem");
    const { titulo, imagemURL, link, ordem } = fields;
    const imageUrl = file
      ? `${request.protocol}://${request.headers.host}/uploads/${file.filename}`
      : imagemURL;

    if (!imageUrl) {
      return reply.code(400).send({ error: "Imagem é obrigatória para criar o banner" });
    }

    const novoBanner = await BannerModel.criar({
      titulo,
      imagemURL: imageUrl,
      link,
      ordem: ordem ? Number(ordem) : 0,
    });

    return reply.code(201).send(novoBanner);
  } catch (error) {
    request.log.error({ err: error }, "Erro ao criar banner");
    return reply.code(500).send({ error: "Erro ao criar banner" });
  }
};

export const atualizarBanner = async (
  request: FastifyRequest<{ Params: BannerParams; Body: Record<string, string> }>,
  reply: FastifyReply,
) => {
  try {
    const { fields, file } = await parseUploadRequest(request, "imagem");
    const { titulo, imagemURL, link, ordem, ativo } = fields;
    const imageUrl = file
      ? `${request.protocol}://${request.headers.host}/uploads/${file.filename}`
      : imagemURL;

    const dadosParaAtualizar: Partial<Banner> = {};
    if (titulo !== undefined) dadosParaAtualizar.titulo = titulo;
    if (imageUrl !== undefined) dadosParaAtualizar.imagemURL = imageUrl;
    if (link !== undefined) dadosParaAtualizar.link = link;
    if (ordem !== undefined) dadosParaAtualizar.ordem = Number(ordem);
    if (ativo !== undefined) dadosParaAtualizar.ativo = ativo === "true";

    if (Object.keys(dadosParaAtualizar).length === 0) {
      return reply.code(400).send({ error: "Nenhum dado fornecido para atualização" });
    }

    const atualizado = await BannerModel.atualizar(
      request.params.id,
      dadosParaAtualizar,
    );
    if (!atualizado) {
      return reply.code(404).send({ error: "Banner não encontrado" });
    }

    const bannerAtualizado = await BannerModel.buscarPorId(request.params.id);
    return reply.send({
      message: "Banner atualizado com sucesso",
      banner: bannerAtualizado,
    });
  } catch (error) {
    request.log.error({ err: error }, "Erro ao atualizar banner");
    return reply.code(500).send({ error: "Erro ao atualizar banner" });
  }
};

export const deletarBanner = async (
  request: FastifyRequest<{ Params: BannerParams }>,
  reply: FastifyReply,
) => {
  try {
    const deletado = await BannerModel.deletar(request.params.id);
    if (!deletado) {
      return reply.code(404).send({ error: "Banner não encontrado" });
    }
    return reply.send({ message: "Banner deletado com sucesso" });
  } catch (error) {
    request.log.error({ err: error }, "Erro ao deletar banner");
    return reply.code(500).send({ error: "Erro ao deletar banner" });
  }
};
