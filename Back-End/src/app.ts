import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import dotenv from "dotenv";
import { fromNodeHeaders } from "better-auth/node";
import { migrate } from "drizzle-orm/mysql2/migrator";

import produtosRoutes from "./routes/produtos.js";
import usuariosRoutes from "./routes/usuarios.js";
import vendasRoutes from "./routes/vendas.js";
import uploadRoutes from "./routes/upload.js";
import bannersRoutes from "./routes/banners.js";
import favoritosRoutes from "./routes/favoritos.js";

import conexao, { criarBanco } from "./database/conexao.js";
import { db } from "./database/db.js";
import { criarAdminPadrao, criarBannersPadrao } from "./database/seed.js";
import { auth } from "./auth/better-auth.js";

dotenv.config();

const app = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

await app.register(cors, {
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

await app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});
await app.register(fastifyStatic, {
  root: path.resolve(process.cwd(), "uploads"),
  prefix: "/uploads/",
});

app.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const headers = fromNodeHeaders(request.headers);
      const url = new URL(request.url, `http://${request.headers.host}`);
      const body = request.body;
      const authRequest = new Request(url, {
        method: request.method,
        headers,
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      const response = await auth.handler(authRequest);

      reply.code(response.status);
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() !== "set-cookie") {
          reply.header(key, value);
        }
      });

      const cookies = response.headers.getSetCookie();
      if (cookies.length > 0) {
        reply.header("set-cookie", cookies);
      }

      return reply.send(response.body ? await response.text() : null);
    } catch (error) {
      request.log.error({ err: error }, "Better Auth request failed");
      return reply.code(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

app.register(produtosRoutes, { prefix: "/produtos" });
app.register(usuariosRoutes, { prefix: "/usuarios" });
app.register(vendasRoutes, { prefix: "/vendas" });
app.register(uploadRoutes, { prefix: "/upload" });
app.register(bannersRoutes, { prefix: "/banners" });
app.register(favoritosRoutes, { prefix: "/favoritos" });

app.get("/", async (_request, reply) => {
  return reply.code(200).send("API do Sorriso do Cerrado está funcionando!");
});

const esperarMySQL = async () => {
  app.log.info("Aguardando conexão com o MySQL...");
  for (let i = 0; i < 45; i++) {
    try {
      await conexao.query("SELECT 1");
      app.log.info("MySQL conectado com sucesso");
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  throw new Error("MySQL não respondeu dentro do tempo limite.");
};

async function inicializarServidor() {
  try {
    await esperarMySQL();
    await criarBanco();

    app.log.info("Executando migrations do Drizzle...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    app.log.info("Migrations executadas com sucesso");

    await criarAdminPadrao();
    await criarBannersPadrao();
    app.log.info("Dados padrões inicializados");

    await app.listen({ port: PORT, host: "0.0.0.0" });
  } catch (error) {
    app.log.error({ err: error }, "Erro crítico ao inicializar o servidor");
    process.exit(1);
  }
}

void inicializarServidor();

export default app;
