import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { housingsTable } from "./housing.schema";

export const housingFeesTable = pgTable("housing_fees", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  housing_id: bigint("housing_id", { mode: "number" })
    .notNull()
    .references(() => housingsTable.id, { onDelete: "restrict" }),
  predecessor_housing_fee_id: bigint("predecessor_housing_fee_id", {
    mode: "number",
  }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

export type HousingFee = InferModel<typeof housingFeesTable>;

export const housingFeesRelations = relations(housingFeesTable, ({ one }) => ({
  predecessor: one(housingFeesTable, {
    fields: [housingFeesTable.predecessor_housing_fee_id],
    references: [housingFeesTable.id],
  }),
}));
