import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import type { ResourceRepository } from "./resource.repository";
import { ResourceQuery, ResourceSchema } from "@repo/types";
import { z } from "zod";
import type { Queue } from "bullmq";
import { hasPermission } from "@repo/auth";
import { trpcAuthError } from "../auth";

export interface ResourceControllerProps {
  repository: ResourceRepository;
  queue: Queue;
}

const resourceProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx,
  });
});

export function addResourceRoutes({
  repository,
  queue,
}: ResourceControllerProps) {
  return router({
    getAll: resourceProcedure
      .input(ResourceQuery.getAll)
      .output(z.array(ResourceSchema.get))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.user.id !== input.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
          });
        }
        return repository.getAll({
          ...input,
          // biome-ignore lint/style/noNonNullAssertion: Checked in middleware
          userId: ctx.user!.user.id,
        });
      }),
    getById: resourceProcedure
      .input(z.object({ id: z.string() }))
      .output(ResourceSchema.get)
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
      .input(ResourceSchema.create)
      .output(ResourceSchema.get)
      .mutation(async ({ input }) => {
        return await repository.getTransaction(async (tx) => {
          const result = await repository.create(input, tx);
          await queue.add("jobName", {
            data: result,
          });
          return result;
        });
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
