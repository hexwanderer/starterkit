import { z } from "zod";

const Direction = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const ResourceQuery = {
  getAll: z.object({
    userId: z.string(),
    filter: z.optional(
      z.object({
        teamId: z.string().optional(),
        teamSlug: z.string().optional(),
        organizationId: z.string().optional(),
      }),
    ),
    sort: z.optional(
      z.object({
        field: z.string(),
        direction: z.nativeEnum(Direction),
      }),
    ),
  }),
  // Info needed to identify a resource for ABAC contexts
  identifying: z.object({
    id: z.string().optional(),
    createdBy: z.string().optional(),
  }),
};

export const ResourceSchema = {
  create: z.object({
    id: z.optional(z.string()),
    title: z.string(),
    description: z.string(),
    teamId: z.string(),
    tags: z.array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
      }),
    ),
    createdBy: z.string(),
  }),
  update: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.union([
      z.array(z.string()),
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      ),
    ]),
  }),
  get: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    teamId: z.string(),
    tags: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
    createdBy: z.string(),
  }),
};

// Exporting types for each schema
export type ResourceQueryGetAll = z.infer<typeof ResourceQuery.getAll>;
export type ResourceQueryIdentifying = z.infer<
  typeof ResourceQuery.identifying
>;

export type ResourceCreate = z.infer<typeof ResourceSchema.create>;
export type ResourceUpdate = z.infer<typeof ResourceSchema.update>;
export type ResourceGet = z.infer<typeof ResourceSchema.get>;
