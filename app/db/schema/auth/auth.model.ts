import { boolean, serial, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { authSchema } from "./auth";
import { InferSelectModel, Placeholder, relations, SQL, sql } from "drizzle-orm";
import { SocialLoginPlatform } from "../../../modules/auth/dto/socialLogin";

export const userprofile = authSchema.table("users", {
  id: serial("id").primaryKey(),
  guid: uuid("guid").unique().notNull().default(sql`gen_random_uuid()`),
  userProfileImage: text("UserProfileImage"),
  displayName: text("DisplayName"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  guestId: text("GuestId"),
  roles: text("Roles").array().notNull().default(sql`ARRAY['user']`),
  isSocialLogin: boolean("IsSocialLogin").default(false).notNull(),
  password: text("password"),//.notNull(), // hashed
  socialLoginPlatform: varchar("SocialLoginPlatform", { length: 250 }),
  username: varchar("username", { length: 250 }).unique().notNull(),
  deleted_as: varchar("deleted_as", { length: 250 }),
  firstName: text("FirstName").notNull(),
  isActive: boolean("IsActive").default(true).notNull(),
  isDeleted: boolean("IsDeleted").default(false).notNull(),
  lastName: text("LastName").notNull(),
  expiresAt: timestamp("ExpiresAt", { withTimezone: true, mode: 'string' }).default(sql`null`),
  createdAt: timestamp("CreatedAt", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).default(sql`null`),
  lastLoginDate: timestamp("LastLoginDate", { withTimezone: true, mode: 'string' }).default(sql`now()`).notNull(),
}, (table) => [
  uniqueIndex("ix_userprofile_email").on(table.email),
  uniqueIndex("ix_userprofile_username").on(table.username),
  uniqueIndex("ix_userprofile_guid").on(table.guid),
]);

export const userProfileRelations = relations(userprofile, ({ one }) => ({
  userApp: one(userApp),
}));

export const userApp = authSchema.table("userApp", {
  user_id: uuid("user_id").primaryKey().references(() => userprofile.guid).notNull(),
  social_platform: varchar("social_platform", { length: 150 }).notNull().default(SocialLoginPlatform.OnaxApp),
  oauth_identity: varchar("oauth_identity", { length: 150 }),
  app_id: varchar("app_id", { length: 150 }).notNull(),
  isActive: boolean("IsActive").default(true).notNull(),
  isDeleted: boolean("IsDeleted").default(false).notNull(),
  deleted_as: varchar("deleted_as", { length: 250 }),
  created_at: timestamp("create_at", { withTimezone: true, mode: 'string' }).notNull().default(sql`now()`),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).notNull().default(sql`now()`),
}, (table) => [
  uniqueIndex("ix_userapp_user_id_app_id").on(table.user_id, table.app_id),
]);

export type UserProfileModel = Omit<InferSelectModel<typeof userprofile>, 'id' | 'expiresAt' | 'guid' | 'role' | 'createdAt' | 'updated_at' | 'lastLoginDate' | 'deleted_as'> & {
  id?: number;
  createdAt?: string | SQL<unknown> | Placeholder<string, any> | undefined;
  updated_at?: string | null;
  expiresAt?: string | null;
  lastLoginDate?: string;
  guid?: string | undefined;
  delete_as?: null;
  roles?: string[];
};
export type UserAppModel = Omit<InferSelectModel<typeof userApp>, 'isActive' | 'isDeleted' | 'created_at' | 'updated_at' | 'deleted_as'> & {
  isActive?: boolean;
  isDeleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type UserAppDetail = {
  userApp: UserAppModel;
  userProfile: UserProfileModel;
}