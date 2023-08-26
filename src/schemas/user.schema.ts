import { InferModel, relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { residentAccountsTable } from "./resident-account.schema";

export const userTypeEnum = pgEnum("user_type", [
  "resident",
  "housing_developer",
]);

export const usersTable = pgTable("users", {
  id: varchar("id").primaryKey(),
  full_name: varchar("full_name").notNull(),
  email: varchar("email").notNull().unique(),
  avatar: text("avatar"),
  type: userTypeEnum("type").notNull(),
  verified_at: timestamp("verified_at"),
  archived_at: timestamp("archived_at"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type User = InferModel<typeof usersTable>;

export const usersRelations = relations(usersTable, ({ one, many }) => ({
  keys: one(userKeysTable, {
    fields: [usersTable.id],
    references: [userKeysTable.user_id],
  }),
  residentAccounts: many(residentAccountsTable),
}));

export const userKeysTable = pgTable("user_keys", {
  id: varchar("id").primaryKey(),
  user_id: varchar("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  hashed_password: varchar("hashed_password"),
});

export const userKeysRelations = relations(userKeysTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userKeysTable.user_id],
    references: [usersTable.id],
  }),
}));

export const insertUserSchema = createInsertSchema(usersTable);

export type InsertUserData = z.infer<typeof insertUserSchema>;

export const createUserSchema = insertUserSchema
  .pick({
    full_name: true,
    email: true,
  })
  .extend({
    password: z.string().min(8),
  });

export type CreateUserData = z.infer<typeof createUserSchema>;

export const selectUserSchema = createSelectSchema(usersTable);

export const apiResponseUserSchema = selectUserSchema.extend({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
