import { z } from "zod";

export const OrganizationSchema = {
  create: z.object({
    name: z.string(),
    slug: z.string(),
  }),
  update: z.object({
    name: z.string(),
    slug: z.string(),
  }),
  get: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    members: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  }),
};

export type OrganizationCreate = z.infer<typeof OrganizationSchema.create>;
export type OrganizationUpdate = z.infer<typeof OrganizationSchema.update>;
export type OrganizationGet = z.infer<typeof OrganizationSchema.get>;
