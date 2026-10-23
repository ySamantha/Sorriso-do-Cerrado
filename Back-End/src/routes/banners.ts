import type { FastifyPluginAsync } from "fastify";
import {
  listarBanners,
  listarBannersAtivos,
  criarBanner,
  atualizarBanner,
  deletarBanner,
} from "../controllers/bannerController.js";
import { autenticar, autorizar } from "../middleware/authMiddleware.js";

const bannersRoutes: FastifyPluginAsync = async (app) => {
  type BannerParams = { id: string };

  app.get("/", listarBanners);
  app.get("/ativos", listarBannersAtivos);
  app.post(
    "/",
    { preHandler: [autenticar, autorizar("admin")] },
    criarBanner,
  );
  app.put<{ Params: BannerParams; Body: Record<string, string> }>(
    "/:id",
    { preHandler: [autenticar, autorizar("admin")] },
    atualizarBanner,
  );
  app.delete<{ Params: BannerParams }>(
    "/:id",
    { preHandler: [autenticar, autorizar("admin")] },
    deletarBanner,
  );
};

export default bannersRoutes;
