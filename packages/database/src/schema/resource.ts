import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const resourceTable = pgTable("resources", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  title: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const resourceTagsTable = pgTable("resource_tags", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  tag: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const resourceTagPairsTable = pgTable("resource_tag_pairs", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  resourceId: text()
    .notNull()
    .references(() => resourceTable.id),
  tagId: text()
    .notNull()
    .references(() => resourceTagsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});
