import type { FastifyReply, FastifyRequest, preHandlerHookHandler } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/better-auth.js";

export const autenticar: preHandlerHookHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return reply.code(401).send({ error: "Não autenticado" });
    }

    request.usuario = {
      id: session.user.id,
      email: session.user.email,
      papel: (session.user as typeof session.user & { papel?: string }).papel || "cliente",
    };
  } catch (error) {
    request.log.error({ err: error }, "Falha ao validar sessão");
    return reply.code(401).send({ error: "Sessão inválida ou expirada" });
  }
};

export const autorizar = (...papeis: string[]): preHandlerHookHandler => {
  const papeisNormalizados = papeis.map((papel) => papel.trim().toLowerCase());

  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.usuario) {
      return reply.code(401).send({ error: "Não autenticado" });
    }

    const papelUsuario = request.usuario.papel?.trim().toLowerCase();
    if (!papelUsuario || !papeisNormalizados.includes(papelUsuario)) {
      return reply.code(403).send({ error: "Acesso negado" });
    }
  };
};
