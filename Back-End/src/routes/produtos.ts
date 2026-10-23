import type { FastifyPluginAsync } from "fastify";
import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from "../controllers/produtoController.js";
import { autenticar, autorizar } from "../middleware/authMiddleware.js";
import type { Produto } from "../models/produtoModel.js";

const produtosRoutes: FastifyPluginAsync = async (app) => {
  type ProductParams = { id: string };
  type ProductBody = Omit<Produto, "id">;

  app.get("/", listarProdutos);
  app.get<{ Params: ProductParams }>("/:id", buscarProdutoPorId);
  app.post<{ Body: ProductBody }>(
    "/",
    { preHandler: [autenticar, autorizar("admin")] },
    criarProduto,
  );
  app.put<{ Params: ProductParams; Body: ProductBody }>(
    "/:id",
    { preHandler: [autenticar, autorizar("admin")] },
    atualizarProduto,
  );
  app.delete<{ Params: ProductParams }>(
    "/:id",
    { preHandler: [autenticar, autorizar("admin")] },
    deletarProduto,
  );
};

export default produtosRoutes;
