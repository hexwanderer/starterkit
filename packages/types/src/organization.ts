import { z } from "zod";

export const OrganizationSchema = {
  create: z.object({
    name: z.string(),
    slug: z.string(),
  }),
  update: z.object({
    id: z.string(),
    name: z.string().optional(),
    slug: z.string().optional(),
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

export const OrganizationMemberSchema = {
  addMember: z.object({
    organizationId: z.string(),
    email: z.string(),
    teamId: z.string().optional(),
  }),
  removeMember: z.object({
    organizationId: z.string(),
    userId: z.string(),
  }),
};

export type OrganizationCreate = z.infer<typeof OrganizationSchema.create>;
export type OrganizationUpdate = z.infer<typeof OrganizationSchema.update>;
export type OrganizationGet = z.infer<typeof OrganizationSchema.get>;

export type OrganizationMemberAdd = z.infer<
  typeof OrganizationMemberSchema.addMember
>;
export type OrganizationMemberRemove = z.infer<
  typeof OrganizationMemberSchema.removeMember
>;
