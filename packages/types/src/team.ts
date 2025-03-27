import { z } from "zod";

const visibility = ["public", "private"] as const;
export type Visibility = (typeof visibility)[number];

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  visibility: z.enum(visibility),
  createdBy: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const teamMemberSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  team: z.object({
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    organizationId: z.string(),
    visibility: z.enum(visibility),
  }),
  userId: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
  }),
  role: z.enum(["owner", "admin", "member"]),
});
