import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import {
  ResourcePostgresImpl,
  type ResourceRepository,
} from "./resource.repository";
import { z } from "zod";
import type { Queue } from "bullmq";
import { hasPermission } from "@repo/auth";
import { trpcAuthError } from "../auth";
import {
  inferSchema,
  listSchema,
  resourceSchema,
  tagSchema,
} from "@repo/types";
import { db } from "@repo/database";

export interface ResourceControllerProps {
  repository: ResourceRepository;
  queue: Queue;
}

const resourceProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const repository = new ResourcePostgresImpl(db);

  return next({
    ctx: {
      ...ctx,
      resourceRepository: repository,
    },
  });
});

export const resourceOps = {
  list: inferSchema(
    listSchema(resourceSchema.pick({ teamId: true, organizationId: true }), [
      "title",
      "createdAt",
    ]),
    z.array(resourceSchema),
  ),
  getById: inferSchema(
    z.string(),
    resourceSchema.merge(z.object({ tags: z.array(tagSchema) })).nullable(),
  ),
  getBySlug: inferSchema(
    z.object({
      slug: z.string(),
      organizationSlug: z.string(),
    }),
    resourceSchema.merge(z.object({ tags: z.array(tagSchema) })).nullable(),
  ),
  create: inferSchema(
    resourceSchema.omit({ id: true, createdAt: true, updatedAt: true }),
    resourceSchema,
  ),
  update: inferSchema(
    resourceSchema
      .pick({ id: true, title: true, description: true, tagIds: true })
      .partial({ title: true, description: true }),
    resourceSchema,
  ),
  delete: inferSchema(z.string(), z.void()),
};

export function addResourceRoutes({
  repository,
  queue,
}: ResourceControllerProps) {
  return router({
    getAll: resourceProcedure
      .input(
        listSchema(
          resourceSchema.pick({ teamId: true, organizationId: true }),
          ["title", "createdAt"],
        ),
      )
      .output(z.array(resourceSchema))
      .query(async ({ ctx, input }) => {
        return repository.getAll(input);
      }),
    getById: resourceProcedure
      .input(z.object({ id: z.string() }))
      .output(resourceSchema)
      .query(async ({ ctx, input }) => {
        const result = await repository.getById(input.id);
        if (!result)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resource not found",
          });

        if (!hasPermission(ctx.user, "resource", "view", result)) {
          throw trpcAuthError("User is not authorized to get a resource");
        }
        return result;
      }),
    create: resourceProcedure
      .input(
        resourceSchema.omit({ id: true, createdAt: true, updatedAt: true }),
      )
      .output(resourceSchema)
      .mutation(async ({ input, ctx }) => {
        if (!hasPermission(ctx.user, "resource", "create")) {
          throw trpcAuthError("User is not authorized to create a resource");
        }
        return await ctx.resourceRepository.create(input);
      }),
    update: resourceProcedure
      .input(
        resourceSchema
          .pick({ id: true, title: true, description: true, tagIds: true })
          .partial({ title: true, description: true }),
      )
      .output(resourceSchema)
      .mutation(async ({ input, ctx }) => {
        const resource = await ctx.resourceRepository.getById(input.id);
        if (
          !resource ||
          !hasPermission(ctx.user, "resource", "update", resource)
        ) {
          throw trpcAuthError("User is not authorized to update a resource");
        }
        return await ctx.resourceRepository.update(input);
      }),
    delete: resourceProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return await ctx.resourceRepository.delete(input.id);
      }),
  });
}
