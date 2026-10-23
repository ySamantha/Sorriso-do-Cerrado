import type { FastifyPluginAsync } from "fastify";
import type { FastifyReply, FastifyRequest } from "fastify";
import { autenticar, autorizar } from "../middleware/authMiddleware.js";
import VendaModel from "../models/vendaModel.js";

type CreateSaleBody = {
  nomeCliente: string;
  emailCliente?: string;
  telefoneCliente?: string;
  total: number;
};

const vendasRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/",
    { preHandler: [autenticar, autorizar("admin")] },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        return reply.send(await VendaModel.listarTodas());
      } catch (error) {
        reply.log.error({ err: error }, "Erro ao buscar vendas");
        return reply.code(500).send({ error: "Erro ao buscar vendas" });
      }
    },
  );

  app.post<{ Body: CreateSaleBody }>(
    "/",
    { preHandler: [autenticar] },
    async (request, reply) => {
      try {
        if (!request.usuario) {
          return reply.code(401).send({ error: "Não autenticado" });
        }

        const venda = await VendaModel.criar(request.body);
        return reply.code(201).send(venda);
      } catch (error) {
        request.log.error({ err: error }, "Erro ao registrar venda");
        return reply.code(500).send({ error: "Erro ao registrar venda" });
      }
    },
  );
};

export default vendasRoutes;
