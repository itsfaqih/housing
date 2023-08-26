import { InferModel, relations } from "drizzle-orm";
import { bigserial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { housingsTable } from "./housing.schema";

export const housingDevelopersTable = pgTable("housing_developers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name").notNull().unique(),
  slug: varchar("slug").notNull().unique(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export type HousingDeveloper = InferModel<typeof housingDevelopersTable>;

export const housingDevelopersRelations = relations(
  housingDevelopersTable,
  ({ many }) => ({
    housings: many(housingsTable),
  })
);
