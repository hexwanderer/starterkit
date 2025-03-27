import { z } from "zod";
import { inferSchema } from "./organization";
import { listSchema } from "./list";

export const resourceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  tagIds: z.array(z.string()),
  teamId: z.string(),
  organizationId: z.string(),
  createdAt: z.string().datetime(),
  createdBy: z.string(),
  updatedAt: z.string().datetime(),
});

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});
