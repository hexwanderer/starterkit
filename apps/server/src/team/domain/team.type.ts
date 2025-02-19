import { type Static, t } from "elysia";

const Visibility = {
  PUBLIC: "public",
  PRIVATE: "private",
} as const;

export const TeamSchema = {
  create: t.Object({
    name: t.String(),
    description: t.String(),
    visibility: t.Enum(Visibility),
    createdBy: t.String(),
  }),
  update: t.Object({
    name: t.String(),
    description: t.String(),
    visibility: t.Enum(Visibility),
  }),
  get: t.Object({
    id: t.String(),
    name: t.String(),
    description: t.String(),
    visibility: t.Enum(Visibility),
    members: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
      }),
    ),
    createdBy: t.String(),
    createdAt: t.String(),
    updatedAt: t.String(),
  }),
};

export type TeamCreate = Static<typeof TeamSchema.create>;
export type TeamUpdate = Static<typeof TeamSchema.update>;
export type TeamGet = Static<typeof TeamSchema.get>;
