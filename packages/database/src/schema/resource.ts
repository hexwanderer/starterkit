import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { teams } from "./team";
import { organizations, users } from "./auth";

export const resources = pgTable("resources", {
  id: uuid()
    .primaryKey()
    .$defaultFn(() => v7()),
  slug: text().notNull(),
  title: text().notNull(),
  description: text().notNull(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
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
  resourceId: text("resource_id")
    .notNull()
    .references(() => resources.id),
  tagId: text("tag_id")
    .notNull()
    .references(() => resourceTags.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
