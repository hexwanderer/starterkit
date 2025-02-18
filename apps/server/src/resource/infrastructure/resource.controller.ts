import { db } from "@repo/database";
import { Elysia, t } from "elysia";
import { ResourceSchema } from "../domain/resource.type";
import { ResourcePostgresImpl } from "./resource.repository";

export const ResourceController = new Elysia({ prefix: "/resources" })
  .decorate({
    repository: new ResourcePostgresImpl(db),
  })
  .get(
    "/all",
    async ({ repository }) => {
      const response = await repository.getAll();
      return {
        status: "success",
        data: response,
      };
    },
    {
      response: {
        200: t.Object({
          status: t.String(),
          data: t.Array(ResourceSchema),
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
        200: ResourceSchema,
        404: t.String(),
      },
    },
  )
  .put(
    "/",
    async ({ repository, body, error }) => {
      const response = await repository.create(body);
      if (error) throw error;
      return response;
    },
    {
      body: ResourceSchema,
      response: ResourceSchema,
    },
  );
