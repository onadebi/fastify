import { serial, text, varchar } from "drizzle-orm/pg-core";
import { authSchema } from "./auth";

export const userprofile = authSchema.table("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(), // hashed
});