import { publicProcedure, router } from "../trpc";
import type { TeamRepository } from "./team.repository";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { SocketServer } from "../socket";
import { hasPermission } from "@repo/auth";
import { trpcAuthError } from "../auth";

const teamProcedure = publicProcedure.use(async ({ ctx, path, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx,
  });
});

export interface TeamControllerProps {
  repository: TeamRepository;
  socket: SocketServer;
}

export function addTeamRoutes({ repository, socket }: TeamControllerProps) {
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
      .query(async ({ ctx, input }) => {
        const result = await repository.getById(input.id);
        if (!result)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found",
          });
        if (!hasPermission(ctx.user, "team", "view", result)) {
          throw trpcAuthError("User is not authorized to get a team");
        }
        return result;
      }),
    getBySlug: teamProcedure
      .input(z.object({ slug: z.string(), organizationSlug: z.string() }))
      .output(TeamSchema.get)
      .query(async ({ ctx, input }) => {
        const result = await repository.getBySlug(
          input.slug,
          input.organizationSlug,
        );
        if (!result)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found",
          });
        if (!hasPermission(ctx.user, "team", "view", result)) {
          throw trpcAuthError("User is not authorized to get a team");
        }
        return result;
      }),
    create: teamProcedure
      .input(TeamSchema.create)
      .output(TeamSchema.get)
      .mutation(async ({ ctx, input }) => {
        if (!hasPermission(ctx.user, "team", "create")) {
          throw trpcAuthError("User is not authorized to create a team");
        }
        return repository.create(input);
      }),
    update: teamProcedure
      .input(TeamSchema.update)
      .output(TeamSchema.get)
      .mutation(async ({ ctx, input }) => {
        const result = await repository.getById(input.id);
        if (!result || !hasPermission(ctx.user, "team", "update", result)) {
          throw trpcAuthError("User is not authorized to update a team");
        }
        return repository.update(input);
      }),
    delete: teamProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const result = await repository.getById(input.id);
        if (!result || !hasPermission(ctx.user, "team", "delete", result)) {
          throw trpcAuthError("User is not authorized to delete a team");
        }
        return repository.delete(input.id);
      }),
    addMember: teamProcedure
      .input(z.object({ id: z.string(), userId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User context must be present to invite another user",
          });
        }
        const result = await repository.addMember(input.id, input.userId);
        // socket.notifyUser(input.userId, {
        //   type: "invited_to_team",
        //   data: {
        //     by: ctx.user.id,
        //   },
        // });
      }),
  });
}
