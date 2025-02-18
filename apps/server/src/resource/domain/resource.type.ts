import { type Static, t } from "elysia";

export const ResourceSchema = {
  create: t.Object({
    id: t.Optional(t.String()),
    title: t.String(),
    description: t.String(),
    tags: t.Union([
      t.Array(t.String()),
      t.Array(
        t.Object({
          id: t.String(),
          name: t.String(),
        }),
      ),
    ]),
  }),
  update: t.Object({
    id: t.String(),
    title: t.String(),
    description: t.String(),
    tags: t.Union([
      t.Array(t.String()),
      t.Array(
        t.Object({
          id: t.String(),
          name: t.String(),
        }),
      ),
    ]),
  }),
  get: t.Object({
    id: t.String(),
    title: t.String(),
    description: t.String(),
    tags: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
      }),
    ),
  }),
};

// Exporting types for each schema
export type ResourceCreate = Static<typeof ResourceSchema.create>;
export type ResourceUpdate = Static<typeof ResourceSchema.update>;
export type ResourceGet = Static<typeof ResourceSchema.get>;
