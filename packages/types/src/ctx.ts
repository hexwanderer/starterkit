import type { Session } from "better-auth";

export interface RequestorContext {
  user: {
    id: string;
    name: string;
    email: string;
  };
  organization: {
    id: string;
    roles: Role[];
  };
  teams: {
    id: string;
  }[];
  session: Session;
}

export type Role =
  | "owner"
  | "admin"
  | "team.delete" // Permission to delete any team
  | "team.creator" // The user who created the team
  | "resource.delete"
  | "user";

export const RoleMappings = {
  owner: ["owner"],
  admin: ["team.delete", "resource.delete", "admin"],
  user: ["user"],
} as Record<string, Role[]>;
