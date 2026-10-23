import type { FastifyPluginAsync } from "fastify";
import {
  listarUsuarios,
  atualizarUsuario,
  atualizarMeuUsuario,
  deletarUsuario,
} from "../controllers/usuarioController.js";
import { autenticar, autorizar } from "../middleware/authMiddleware.js";

const usuariosRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", async (_request, reply) => {
    return reply.code(410).send({
      error: "Use o endpoint oficial do Better Auth em /api/auth/sign-up/email para criar uma conta.",
    });
  });

  app.post("/login", async (_request, reply) => {
    return reply.code(410).send({
      error: "Utilize o endpoint oficial do Better Auth em /api/auth/sign-in/email para efetuar login.",
    });
  });

  app.get("/", { preHandler: [autenticar, autorizar("admin")] }, listarUsuarios);

  app.put<{ Body: { nome?: string; email?: string } }>(
    "/me",
    { preHandler: [autenticar] },
    atualizarMeuUsuario,
  );

  app.put<{ Params: { id: string }; Body: { nome?: string; email?: string } }>(
    "/:id",
    { preHandler: [autenticar] },
    atualizarUsuario,
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: [autenticar, autorizar("admin")] },
    deletarUsuario,
  );
};

export default usuariosRoutes;
