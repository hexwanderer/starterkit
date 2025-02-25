import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import type { ResourceRepository } from "./resource.repository";
import { ResourceQuery, ResourceSchema } from "./resource.type";
import { z } from "zod";

export interface ResourceControllerProps {
  repository: ResourceRepository;
}

const resourceProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx,
  });
});

export function addResourceRoutes({ repository }: ResourceControllerProps) {
  return router({
    getAll: resourceProcedure
      .input(ResourceQuery.getAll)
      .output(z.array(ResourceSchema.get))
      .query(async ({ input }) => {
        return repository.getAll(input);
      }),
    getById: resourceProcedure
      .input(z.object({ id: z.string() }))
      .output(ResourceSchema.get)
      .query(async ({ input }) => {
        const result = await repository.getById(input.id);
        if (!result)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Resource not found",
          });
        return result;
      }),
    create: resourceProcedure
      .input(ResourceSchema.create)
      .output(ResourceSchema.get)
      .mutation(async ({ input }) => {
        return repository.create(input);
      }),
    update: resourceProcedure
      .input(ResourceSchema.update)
      .output(ResourceSchema.get)
      .mutation(async ({ input }) => {
        return repository.update(input);
      }),
    delete: resourceProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return repository.delete(input.id);
      }),
  });
}
