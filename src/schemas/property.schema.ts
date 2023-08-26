import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { housingsTable } from "./housing.schema";
import { z } from "zod";
import { propertyOccupanciesTable } from "./property-occupancy.schema";

export const propertiesTable = pgTable(
  "properties",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    name: varchar("name").notNull(),
    slug: varchar("slug").notNull(),
    housing_id: bigint("housing_id", { mode: "number" })
      .notNull()
      .references(() => housingsTable.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    archived_at: timestamp("archived_at"),
  },
  (t) => ({
    unq: unique().on(t.slug, t.housing_id),
  })
);

export type Property = InferModel<typeof propertiesTable>;

export const propertiesRelations = relations(propertiesTable, ({ many }) => ({
  occupancies: many(propertyOccupanciesTable),
}));

export type InsertPropertyData = InferModel<typeof propertiesTable, "insert">;

export const insertPropertySchema = createInsertSchema(propertiesTable);

export const createPropertySchema = insertPropertySchema.pick({
  name: true,
});

export type CreatePropertyData = z.infer<typeof createPropertySchema>;

export const selectPropertySchema = createSelectSchema(propertiesTable);

export const updatePropertySchema = createPropertySchema.pick({
  name: true,
});

export type UpdatePropertyData = z.infer<typeof updatePropertySchema>;

export const apiResponsePropertySchema = selectPropertySchema.pick({
  id: true,
  name: true,
  slug: true,
});
