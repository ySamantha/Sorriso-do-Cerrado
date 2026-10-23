import type { FastifyPluginAsync } from "fastify";
import { parseUploadRequest } from "../middleware/uploadRequest.js";

const uploadRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", async (request, reply) => {
    try {
      const { file } = await parseUploadRequest(request, "imagem");
      if (!file) {
        return reply.code(400).send({ error: "Nenhum arquivo enviado" });
      }

      const url = `${request.protocol}://${request.headers.host}/uploads/${file.filename}`;
      return reply.send({ url });
    } catch (error) {
      request.log.error({ err: error }, "Erro ao enviar arquivo");
      return reply.code(500).send({ error: "Erro ao enviar arquivo" });
    }
  });
};

export default uploadRoutes;
