import { InferModel, relations } from "drizzle-orm";
import { bigint, bigserial, pgTable, timestamp } from "drizzle-orm/pg-core";
import { housingsTable } from "./housing.schema";
import { housingDeveloperAccountsTable } from "./housing-developer-account.schema";

export const housingOwnershipsTable = pgTable("housing_ownerships", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  housing_id: bigint("housing_id", { mode: "number" })
    .notNull()
    .references(() => housingsTable.id, { onDelete: "restrict" }),
  housing_developer_account_id: bigint("housing_developer_account_id", {
    mode: "number",
  })
    .notNull()
    .references(() => housingDeveloperAccountsTable.id, {
      onDelete: "restrict",
    }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  deleted_at: timestamp("deleted_at"),
});

export type HousingOwnership = InferModel<typeof housingOwnershipsTable>;

export const housingOwnershipsRelations = relations(
  housingOwnershipsTable,
  ({ one }) => ({
    housing: one(housingsTable, {
      fields: [housingOwnershipsTable.housing_id],
      references: [housingsTable.id],
    }),
    housingDeveloperAccount: one(housingDeveloperAccountsTable, {
      fields: [housingOwnershipsTable.housing_developer_account_id],
      references: [housingDeveloperAccountsTable.id],
    }),
  })
);
