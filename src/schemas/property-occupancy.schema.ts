import { InferModel, relations } from "drizzle-orm";
import { bigint, bigserial, pgTable, timestamp, unique } from "drizzle-orm/pg-core";
import { propertiesTable } from "./property.schema";
import { residentAccountsTable } from "./resident-account.schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const propertyOccupanciesTable = pgTable("property_occupancies", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  property_id: bigint("property_id", { mode: "number" })
    .notNull()
    .references(() => propertiesTable.id, { onDelete: "restrict" }),
  resident_account_id: bigint("resident_account_id", {
    mode: "number",
  })
    .notNull()
    .references(() => residentAccountsTable.id, {
      onDelete: "restrict",
    }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  deleted_at: timestamp("deleted_at"),
}, (t) => ({
  unique: unique().on
}));

export type PropertyOccupancy = InferModel<typeof propertyOccupanciesTable>;

export const propertyOccupanciesRelations = relations(
  propertyOccupanciesTable,
  ({ one }) => ({
    property: one(propertiesTable, {
      fields: [propertyOccupanciesTable.property_id],
      references: [propertiesTable.id],
    }),
    residentAccount: one(residentAccountsTable, {
      fields: [propertyOccupanciesTable.resident_account_id],
      references: [residentAccountsTable.id],
    }),
  })
);

export const insertPropertyOccupancySchema = createInsertSchema(
  propertyOccupanciesTable
);

export type InsertPropertyOccupancyData = InferModel<
  typeof propertyOccupanciesTable,
  "insert"
>;

export const createPropertyOccupancySchema = insertPropertyOccupancySchema.pick(
  {
    resident_account_id: true,
  }
);

export type CreatePropertyOccupancyData = z.infer<
  typeof createPropertyOccupancySchema
>;
