import { z } from "zod";

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const OrganizationMemberQuery = {
  getMembers: z.object({
    organizationId: z.string(),
    userId: z.string().optional(),
  }),
};

export const OrganizationMemberSchema = {
  addMember: z.object({
    organizationId: z.string(),
    email: z.string(),
    teamId: z.string().optional(),
  }),
  changeRole: z.object({
    memberId: z.string(),
    role: z.string(),
  }),
  get: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    role: z.string(),
  }),
  removeMember: z.object({
    organizationId: z.string(),
    userId: z.string(),
  }),
};

const organizationCreate = OrganizationSchema.omit({ id: true });
export type OrganizationCreate = z.infer<typeof organizationCreate>;

const organizationUpdate = OrganizationSchema.partial({
  name: true,
  slug: true,
});
export type OrganizationUpdate = z.infer<typeof organizationUpdate>;

const organizationGet = OrganizationSchema.merge(
  z.object({
    members: z.array(OrganizationMemberSchema.get),
  }),
);
export type OrganizationGet = z.infer<typeof organizationGet>;

export type OrganizationMemberQueryGetMembers = z.infer<
  typeof OrganizationMemberQuery.getMembers
>;

export type OrganizationMemberAdd = z.infer<
  typeof OrganizationMemberSchema.addMember
>;
export type OrganizationMemberGet = z.infer<
  typeof OrganizationMemberSchema.get
>;
export type OrganizationMemberChangeRole = z.infer<
  typeof OrganizationMemberSchema.changeRole
>;
export type OrganizationMemberRemove = z.infer<
  typeof OrganizationMemberSchema.removeMember
>;
