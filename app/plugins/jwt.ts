import fp from "fastify-plugin";
import {FastifyRequest, FastifyReply} from 'fastify'

export default fp(async (app) => {
  app.register(import("@fastify/jwt"), {
    secret: process.env.JWT_SECRET!,
  });

  app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    try { await req.jwtVerify(); }
    catch { return reply.status(401).send({ error: "Unauthorized" }); }
  });
});

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}
