import { InferModel, relations } from "drizzle-orm";
import { bigint, bigserial, pgTable, timestamp } from "drizzle-orm/pg-core";
import { housingFeesTable } from "./housing-fee.schema";

export const housingFeeBillsTable = pgTable("housing_fee_bills", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  housing_fee_id: bigint("housing_fee_id", { mode: "number" })
    .notNull()
    .references(() => housingFeesTable.id, { onDelete: "restrict" }),
  amount: bigint("amount", { mode: "number" }).notNull(),
  due_at: timestamp("due_at").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export type HousingFeePayment = InferModel<typeof housingFeeBillsTable>;

export const housingFeeBillsRelations = relations(
  housingFeeBillsTable,
  ({ one }) => ({
    housingFee: one(housingFeesTable, {
      fields: [housingFeeBillsTable.housing_fee_id],
      references: [housingFeesTable.id],
    }),
  })
);
