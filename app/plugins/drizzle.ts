import { drizzle } from "drizzle-orm/node-postgres";
// import pg from "pg";
import fp from "fastify-plugin";
// import appsettings from "../config/appsettings";
import { dbConn } from "../db/dbConfig";

export default fp(async (app) => {
  // const client = new pg.Pool({ connectionString: appsettings.DB.dbConString });
  // const db = drizzle(client);

  app.decorate("db", dbConn);
});

declare module "fastify" {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle>;
  }
}
