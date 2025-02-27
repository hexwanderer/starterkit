import { TeamQuery, TeamSchema } from "@repo/types";
import { publicProcedure, router } from "../trpc";
import type { TeamRepository } from "./team.repository";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const teamProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx,
  });
});

export interface TeamControllerProps {
  repository: TeamRepository;
}

export function addTeamRoutes({ repository }: TeamControllerProps) {
  return router({
    getAll: teamProcedure
      .input(TeamQuery.getAll)
      .output(z.array(TeamSchema.get))
      .query(async ({ input }) => {
        return repository.getAll(input);
      }),
    getById: teamProcedure
      .input(z.object({ id: z.string() }))
      .output(TeamSchema.get)
      .query(async ({ input }) => {
        const result = await repository.getById(input.id);
        if (!result)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found",
          });
        return result;
      }),
    getBySlug: teamProcedure
      .input(z.object({ slug: z.string(), organizationSlug: z.string() }))
      .output(TeamSchema.get)
      .query(async ({ input }) => {
        const result = await repository.getBySlug(
          input.slug,
          input.organizationSlug,
        );
        if (!result)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found",
          });
        return result;
      }),
    create: teamProcedure
      .input(TeamSchema.create)
      .output(TeamSchema.get)
      .mutation(async ({ input }) => {
        return repository.create(input);
      }),
    update: teamProcedure
      .input(TeamSchema.update)
      .output(TeamSchema.get)
      .mutation(async ({ input }) => {
        return repository.update(input);
      }),
    delete: teamProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        return repository.delete(input.id);
      }),
  });
}
