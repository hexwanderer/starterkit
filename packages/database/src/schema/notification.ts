import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const notifications = pgTable("notifications", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v7()),
  destination: text().notNull(),
  avatar: text(),
  title: text().notNull(),
  description: text().notNull(),
  attachedResource: jsonb("attached_resource"),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
  readAt: timestamp("readAt"),
});
