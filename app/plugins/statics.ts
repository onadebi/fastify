import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import path from "path";

export default fp(async (app) => {
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "static"),
    prefix: "/static", // optional, adjust if needed
  });
});