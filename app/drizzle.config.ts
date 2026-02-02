import { defineConfig } from 'drizzle-kit';
import appsettings from './common/config/appsettings';


export default defineConfig({
  out: './drizzle',
  schema: ['./app/db/schema/**/*.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: appsettings.DB.dbConString!,
  },
  verbose: true,
  strict: true,
  //#region customise where migrations are stored in the database
  migrations: {
    schema: 'drizzle',
    table: 'drizzle_migrations',
  }
  //#endregion
});
