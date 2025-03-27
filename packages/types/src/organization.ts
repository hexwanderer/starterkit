import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

function inferSchema<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
  input: I,
  output: O,
): { input: I; output: O } {
  return {
    input: input as I,
    output: output as O,
  };
}

export const organizationMemberSchema = z.object({
  id: z.string().min(1),
  organizationId: z.string(),
  organization: z.object({
    name: z.string(),
    slug: z.string(),
  }),
  userId: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
  }),
  role: z.string(),
  createdAt: z.string().datetime(),
});

export const organizationOps = {
  get: inferSchema(z.string(), z.nullable(organizationSchema)),
  create: inferSchema(
    organizationSchema.omit({ id: true }),
    organizationSchema.merge(
      z.object({
        members: z.array(
          organizationMemberSchema.pick({ id: true, userId: true, role: true }),
        ),
      }),
    ),
  ),
  update: inferSchema(
    organizationSchema.partial({ name: true, slug: true }),
    organizationSchema,
  ),
  delete: inferSchema(z.string(), z.void()),
};

export const organizationMemberOps = {
  add: inferSchema(
    z.object({
      organizationId: z.string(),
      email: z.string(),
    }),
    z.void(),
  ),
  remove: inferSchema(
    z.object({
      organizationId: z.string().min(1),
      userId: z.string().min(1),
    }),
    z.void(),
  ),
  get: inferSchema(z.string(), z.array(organizationMemberSchema)),
  changeRole: inferSchema(
    z.object({ memberId: z.string(), role: z.string() }),
    z.void(),
  ),
};
