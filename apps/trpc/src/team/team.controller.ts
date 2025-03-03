import { TeamQuery, TeamSchema } from "@repo/types";
import { publicProcedure, router } from "../trpc";
import type { TeamRepository } from "./team.repository";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import type { SocketServer } from "../socket";
import { hasPermission } from "@repo/auth";

const teamProcedure = publicProcedure.use(async ({ ctx, path, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // const regex: RegExp = /api\/([a-zA-Z0-9])\.([a-zA-Z0-9])/;
  // const [, object, action] = path.match(regex) ?? [];
  // const objectAsKey = object as keyof Permissions;
  // const act = action as "view" | "create" | "update" | "delete";

  // if (
  //   !hasPermission(
  //     {
  //       roles: ["owner", "admin", "user"],
  //       id: ctx.user.id,
  //       activeOrganizationId: "",
  //     },
  //     "team", // TODO: Cast to correct type
  //     act,
  //   )
  // ) {
  //   throw new TRPCError({
  //     code: "UNAUTHORIZED",
  //     message: "User is not authorized to perform this action",
  //   });
  // }
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
