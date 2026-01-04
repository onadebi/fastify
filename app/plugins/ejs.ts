import fp from "fastify-plugin";
import view from "@fastify/view";
import ejs from "ejs";
import path from "path";

export default fp(async (app) => {
  app.register(view, {
    engine: { ejs },
    root: path.join(process.cwd(), "views")
  });
});
