import { type Static, t } from "elysia";
import { z } from "zod";

const Direction = {
  ASC: "asc",
  DESC: "desc",
} as const;

export const TeamQuery = {
  getAll: z
    .object({
      filter: z
        .object({
          organizationId: z.string(),
        })
        .optional(),
      sort: z
        .object({
          field: z.string(),
          direction: z.nativeEnum(Direction),
        })
        .optional(),
    })
    .optional(),
};

const Visibility = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export const TeamSchema = {
  create: z.object({
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    organizationId: z.string(),
    visibility: z.nativeEnum(Visibility),
    createdBy: z.string(),
  }),
  update: z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    visibility: z.nativeEnum(Visibility),
  }),
  get: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    organizationId: z.string(),
    visibility: z.nativeEnum(Visibility),
    members: z.array(
      z.object({
        id: z.string(),
        user: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        }),
        role: z.string(),
      }),
    ),
    createdBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
};

export type TeamQueryGetAll = z.infer<typeof TeamQuery.getAll>;

export type TeamCreate = z.infer<typeof TeamSchema.create>;
export type TeamUpdate = z.infer<typeof TeamSchema.update>;
export type TeamGet = z.infer<typeof TeamSchema.get>;
