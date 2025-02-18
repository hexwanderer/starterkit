import { type Static, t } from "elysia";

export const ResourceSchema = t.Object({
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
});

export type Resource = Static<typeof ResourceSchema>;
