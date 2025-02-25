import { z } from "zod";

const Direction = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const ResourceQuery = {
  getAll: z
    .object({
      filter: z.optional(
        z.object({
          teamId: z.string(),
        }),
      ),
      sort: z.optional(
        z.object({
          field: z.string(),
          direction: z.nativeEnum(Direction),
        }),
      ),
    })
    .optional(),
};

export const ResourceSchema = {
  create: z.object({
    id: z.optional(z.string()),
    title: z.string(),
    description: z.string(),
    teamId: z.string(),
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
  }),
};

// Exporting types for each schema
export type ResourceQueryGetAll = z.infer<typeof ResourceQuery.getAll>;

export type ResourceCreate = z.infer<typeof ResourceSchema.create>;
export type ResourceUpdate = z.infer<typeof ResourceSchema.update>;
export type ResourceGet = z.infer<typeof ResourceSchema.get>;
