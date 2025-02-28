import { boolean, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { organizations, users } from "./auth";

export const teams = pgTable(
  "teams",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => v7()),
    name: text().notNull(),
    description: text().notNull(),
    slug: text().notNull(),
    isPublic: boolean("is_public").notNull(),
    organizationId: text()
      .notNull()
      .references(() => organizations.id),
    createdBy: text().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [unique("teams_slug_unique").on(t.slug, t.organizationId)],
);

export const teamMembers = pgTable("team_members", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  teamId: text()
    .notNull()
    .references(() => teams.id),
  userId: text()
    .notNull()
    .references(() => users.id),
  role: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
