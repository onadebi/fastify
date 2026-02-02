import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { schema } from "../../db/schema";
import appsettings from "./appsettings";

const pool = new Pool({
    connectionString: appsettings.DB.dbConString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
});

export const dbConn = drizzle(pool, {
    schema,
    logger: appsettings.ENV.env === 'development'
});

export type Database = typeof dbConn;
