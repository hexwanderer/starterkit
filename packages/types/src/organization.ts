import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export function inferSchema<I extends z.ZodTypeAny, O extends z.ZodTypeAny>(
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
