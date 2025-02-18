import type { InferSelectModel } from "drizzle-orm";
import type { organizations, sessions, users } from "./auth";

export type Organization = InferSelectModel<typeof organizations>;
export type OrganizationInsert = InferSelectModel<typeof organizations>;

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferSelectModel<typeof users>;

export type Session = InferSelectModel<typeof sessions>;
export type SessionInsert = InferSelectModel<typeof sessions>;
