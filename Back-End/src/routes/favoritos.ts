import type { FastifyPluginAsync } from "fastify";
import { autenticar } from "../middleware/authMiddleware.js";
import FavoritoModel from "../models/favoritoModel.js";

type AddFavoriteBody = {
  id_produto?: string | number;
  produto_id?: string | number;
};

type FavoriteParams = {
  id_produto: string;
};

const favoritosRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: [autenticar] }, async (request, reply) => {
    try {
      if (!request.usuario) {
        return reply.code(401).send({ error: "Não autenticado" });
      }
      return reply.send(await FavoritoModel.listarPorUsuario(request.usuario.id));
    } catch (error) {
      request.log.error({ err: error }, "Erro ao buscar favoritos");
      return reply.code(500).send({ error: "Erro ao buscar favoritos" });
    }
  });

  app.post<{ Body: AddFavoriteBody }>(
    "/",
    { preHandler: [autenticar] },
    async (request, reply) => {
      try {
        if (!request.usuario) {
          return reply.code(401).send({ error: "Não autenticado" });
        }

        const productId = request.body.id_produto ?? request.body.produto_id;
        if (!productId || Number.isNaN(Number(productId))) {
          return reply.code(400).send({
            error: "id_produto é obrigatório e deve ser numérico",
          });
        }

        await FavoritoModel.adicionar(request.usuario.id, Number(productId));
        return reply.code(201).send({ message: "Favorito adicionado" });
      } catch (error) {
        request.log.error({ err: error }, "Erro ao adicionar favorito");
        return reply.code(500).send({ error: "Erro ao adicionar favorito" });
      }
    },
  );

  app.delete<{ Params: FavoriteParams }>(
    "/:id_produto",
    { preHandler: [autenticar] },
    async (request, reply) => {
      try {
        if (!request.usuario) {
          return reply.code(401).send({ error: "Não autenticado" });
        }

        const productId = Number(request.params.id_produto);
        if (!Number.isFinite(productId)) {
          return reply.code(400).send({
            error: "id_produto é obrigatório e deve ser numérico",
          });
        }

        await FavoritoModel.remover(request.usuario.id, productId);
        return reply.send({ message: "Favorito removido" });
      } catch (error) {
        request.log.error({ err: error }, "Erro ao remover favorito");
        return reply.code(500).send({ error: "Erro ao remover favorito" });
      }
    },
  );
};

export default favoritosRoutes;
