import fp from "fastify-plugin";
import fastifyStatic from "@fastify/static";
import path from "path";

export default fp(async (app) => {
  app.register(fastifyStatic, {
    root: path.join(process.cwd(), "public"),
    prefix: "/public/", // optional, adjust if needed
  });
});