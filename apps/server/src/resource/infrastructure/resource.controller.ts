import { db } from "@repo/database";
import { Elysia, t } from "elysia";
import { ResourceSchema, ResourceQuery } from "../domain/resource.type";
import { ResourcePostgresImpl } from "./resource.repository";
import { hasPermission } from "@repo/auth";
import { auth } from "../../shared/state/auth";

export const ResourceController = new Elysia({ prefix: "/resources" })
  .decorate({
    repository: new ResourcePostgresImpl(db),
  })
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });
    console.log(`session ${session?.session} user ${session?.user}`);

    if (!session || !session.user || !session.session) {
      return {
        user: null,
        session: null,
      };
    }

    return {
      user: session.user,
      session: session.session,
    };
  })
  .get(
    "/",
    async ({ repository, body, error }) => {
      try {
        const response = await repository.getAll(body);
        return {
          data: response,
        };
      } catch (e) {
        return error(500, "Internal server error");
      }
    },
    {
      body: t.Optional(ResourceQuery.getAll),
      response: {
        200: t.Object({
          data: t.Array(ResourceSchema.get),
        }),
        500: t.String(),
      },
    },
  )
  .get(
    "/:id",
    async ({ repository, params: { id }, error }) => {
      const response = await repository.getById(id);
      if (!response) {
        return error(404, "Resource not found");
      }
      return response;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      response: {
        200: ResourceSchema.get,
        404: t.String(),
      },
    },
  )
  .put(
    "/",
    async ({ headers, repository, body, error, user, session }) => {
      if (
        !hasPermission(
          {
            id: user?.id ?? "",
            active_organization_id: session?.activeOrganizationId ?? "",
            roles: ["user"],
          },
          "resource",
          "create",
        )
      ) {
        error(401, "Unauthorized");
      }
      const response = await repository.create(body);
      if (error) throw error;
      return response;
    },
    {
      body: ResourceSchema.create,
      response: {
        200: ResourceSchema.get,
        401: t.String(),
      },
    },
  )
  .patch(
    "/:id",
    async ({ repository, params: { id }, body, error }) => {
      try {
        const response = await repository.update({
          ...body,
          id,
        });
        return;
      } catch (e) {
        return error(500, "Internal server error");
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: ResourceSchema.create,
      response: {
        200: t.Void(),
        404: t.String(),
        500: t.String(),
      },
    },
  );
