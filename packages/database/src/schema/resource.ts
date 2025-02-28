import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { teams } from "./team";

export const resources = pgTable("resources", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  title: text().notNull(),
  description: text().notNull(),
  teamId: text()
    .notNull()
    .references(() => teams.id),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const resourceTags = pgTable("resource_tags", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  tag: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const resourceTagPairs = pgTable("resource_tag_pairs", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  resourceId: text()
    .notNull()
    .references(() => resources.id),
  tagId: text()
    .notNull()
    .references(() => resourceTags.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
