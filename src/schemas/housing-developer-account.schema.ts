import { InferModel, relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  timestamp,
  bigserial,
  bigint,
  varchar,
} from "drizzle-orm/pg-core";
import { housingDevelopersTable } from "./housing-developer.schema";
import { housingOwnershipsTable } from "./housing-ownership.schema";
import { usersTable } from "./user.schema";

export const housingDeveloperRoleEnum = pgEnum("housing_developer_role", [
  "admin",
  "staff",
  "customer_service",
]);

export const housingDeveloperAccountsTable = pgTable(
  "housing_developer_accounts",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    role: housingDeveloperRoleEnum("role"),
    user_id: varchar("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    housing_developer_id: bigint("housing_developer_id", { mode: "number" })
      .notNull()
      .references(() => housingDevelopersTable.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    archived_at: timestamp("archived_at"),
  }
);

export type HousingDeveloperAccount = InferModel<
  typeof housingDeveloperAccountsTable
>;

export const housingDeveloperAccountsRelations = relations(
  housingDeveloperAccountsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [housingDeveloperAccountsTable.user_id],
      references: [usersTable.id],
    }),
    housingDeveloper: one(housingDevelopersTable, {
      fields: [housingDeveloperAccountsTable.housing_developer_id],
      references: [housingDevelopersTable.id],
    }),
    housingOwnerships: many(housingOwnershipsTable),
  })
);
