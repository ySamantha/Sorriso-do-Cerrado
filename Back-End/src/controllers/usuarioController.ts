import type { FastifyReply, FastifyRequest } from "fastify";
import UsuarioModel from "../models/usuarioModel.js";
import { db } from "../database/db.js";
import { user } from "../database/schema.js";
import { eq } from "drizzle-orm";

type UserParams = { id: string };
type UpdateUserBody = { nome?: string; email?: string };

export const listarUsuarios = async (_request: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.send(await UsuarioModel.listarTodos());
  } catch (error) {
    reply.log.error({ err: error }, "Erro ao listar usuários");
    return reply.code(500).send({ error: "Erro ao listar usuários" });
  }
};

export const atualizarUsuario = async (
  request: FastifyRequest<{ Params: UserParams; Body: UpdateUserBody }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  if (!id) {
    return reply.code(400).send({ error: "ID do usuário é obrigatório" });
  }

  try {
    if (!request.usuario) {
      return reply.code(401).send({ error: "Não autenticado" });
    }

    const logado = await UsuarioModel.buscarPorId(request.usuario.id);
    const isOwner = request.usuario.id === id;
    const isAdmin = logado?.papel === "admin";

    if (!isOwner && !isAdmin) {
      return reply.code(403).send({ error: "Acesso negado" });
    }

    await db
      .update(user)
      .set({
        name: request.body.nome,
        email: request.body.email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id));

    return reply.send({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    reply.log.error({ err: error }, "Erro ao atualizar usuário");
    return reply.code(500).send({ error: "Erro ao atualizar usuário" });
  }
};

export const atualizarMeuUsuario = async (
  request: FastifyRequest<{ Body: UpdateUserBody }>,
  reply: FastifyReply,
) => {
  if (!request.usuario) {
    return reply.code(401).send({ error: "Não autenticado" });
  }

  try {
    await db
      .update(user)
      .set({
        name: request.body.nome,
        email: request.body.email,
        updatedAt: new Date(),
      })
      .where(eq(user.id, request.usuario.id));

    return reply.send({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    request.log.error({ err: error }, "Erro ao atualizar usuário");
    return reply.code(500).send({ error: "Erro ao atualizar usuário" });
  }
};

export const deletarUsuario = async (
  request: FastifyRequest<{ Params: UserParams }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;

  if (!id) {
    return reply.code(400).send({ error: "ID do usuário é obrigatório" });
  }

  try {
    if (!request.usuario) {
      return reply.code(401).send({ error: "Não autenticado" });
    }

    const logado = await UsuarioModel.buscarPorId(request.usuario.id);
    if (logado?.papel !== "admin") {
      return reply.code(403).send({ error: "Acesso negado" });
    }

    const deletado = await UsuarioModel.deletar(id);
    if (!deletado) {
      return reply.code(404).send({ error: "Usuário não encontrado" });
    }

    return reply.send({ message: "Usuário deletado" });
  } catch (error) {
    reply.log.error({ err: error }, "Erro ao deletar usuário");
    return reply.code(500).send({ error: "Erro ao deletar usuário" });
  }
};
