import { type Static, t } from "elysia";

export const OrganizationSchema = {
  create: t.Object({
    name: t.String(),
    slug: t.String(),
  }),
  update: t.Object({
    name: t.String(),
    slug: t.String(),
  }),
  get: t.Object({
    id: t.String(),
    name: t.String(),
    slug: t.String(),
    members: t.Array(
      t.Object({
        id: t.String(),
        name: t.String(),
      }),
    ),
  }),
};

export type OrganizationCreate = Static<typeof OrganizationSchema.create>;
export type OrganizationUpdate = Static<typeof OrganizationSchema.update>;
export type OrganizationGet = Static<typeof OrganizationSchema.get>;
