import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    usuario?: {
      id: string;
      email: string;
      papel?: string;
    };
  }
}
