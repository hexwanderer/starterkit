import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const log = pgTable("log", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
});

export type Log = InferSelectModel<typeof log>;
export type LogInsert = InferInsertModel<typeof log>;
