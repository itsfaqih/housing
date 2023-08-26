import { InferModel, relations } from "drizzle-orm";
import {
  bigint,
  bigserial,
  pgTable,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import { selectUserSchema, usersTable } from "./user.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { housingsTable } from "./housing.schema";
import { propertyOccupanciesTable } from "./property-occupancy.schema";

export const residentAccountsTable = pgTable(
  "resident_accounts",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    user_id: varchar("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    housing_id: bigint("housing_id", { mode: "number" })
      .notNull()
      .references(() => housingsTable.id, { onDelete: "restrict" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    deleted_at: timestamp("deleted_at"),
  },
  (t) => ({
    unique: unique().on(t.user_id, t.housing_id),
  })
);

export type ResidentAccount = InferModel<typeof residentAccountsTable>;

export const residentAccountsRelations = relations(
  residentAccountsTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [residentAccountsTable.user_id],
      references: [usersTable.id],
    }),
    housing: one(housingsTable, {
      fields: [residentAccountsTable.housing_id],
      references: [housingsTable.id],
    }),
    propertyOccupancies: many(propertyOccupanciesTable),
  })
);

export const insertResidentAccountSchema = createInsertSchema(
  residentAccountsTable
);

export const createResidentAccountSchema = insertResidentAccountSchema.pick({
  user_id: true,
});

export type CreateResidentAccountData = z.infer<
  typeof createResidentAccountSchema
>;

export const apiResponseResidentAccountSchema = createSelectSchema(
  residentAccountsTable
)
  .pick({
    id: true,
  })
  .extend({
    user: z.lazy(() =>
      selectUserSchema.pick({
        full_name: true,
        email: true,
        avatar: true,
      })
    ),
  });
