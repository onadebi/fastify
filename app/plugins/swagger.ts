import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

export default fp(async (app) => {
  app.register(swagger, {
    openapi: {
      info: { title: "Fastify Starter API", version: "1.0.0" }
    },
  });

  app.register(swaggerUI, { routePrefix: "/docs" });
});
