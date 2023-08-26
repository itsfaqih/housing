import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { housingDevelopersTable } from "./housing-developer.schema";
import { housingOwnershipsTable } from "./housing-ownership.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { residentAccountsTable } from "./resident-account.schema";

export const housingsTable = pgTable(
  "housings",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: varchar("name").notNull(),
    slug: varchar("slug").notNull().unique(),
    address: text("address").notNull(),
    housing_developer_id: bigint("housing_developer_id", { mode: "number" })
      .notNull()
      .references(() => housingDevelopersTable.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    unq: unique().on(t.name, t.housing_developer_id),
  })
);

export type Housing = InferModel<typeof housingsTable>;

export const housingsRelations = relations(housingsTable, ({ one, many }) => ({
  developer: one(housingDevelopersTable, {
    fields: [housingsTable.housing_developer_id],
    references: [housingDevelopersTable.id],
  }),
  ownerships: many(housingOwnershipsTable),
  residents: many(residentAccountsTable),
}));

export type InsertHousingData = InferModel<typeof housingsTable, "insert">;

export const insertHousingSchema = createInsertSchema(housingsTable);

export const createHousingSchema = insertHousingSchema.pick({
  name: true,
  address: true,
});

export type CreateHousingSchema = z.infer<typeof createHousingSchema>;

export const apiResponseHousingSchema = createSelectSchema(
  housingsTable
).extend({
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
