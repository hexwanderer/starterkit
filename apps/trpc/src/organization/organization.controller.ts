import { OrganizationSchema, TeamSchema } from "@repo/types";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { OrganizationRepository } from "./organization.repository";
import type { TeamRepository } from "../team/team.repository";
import { z } from "zod";
import { fromNodeHeaders } from "better-auth/node";

const organizationProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx,
  });
});

export interface OrganizationControllerProps {
  repository: OrganizationRepository;
  teamRepository: TeamRepository;
}

export function addOrganizationRoutes({
  repository,
  teamRepository,
}: OrganizationControllerProps) {
  return router({
    create: organizationProcedure
      .input(OrganizationSchema.create)
      .output(
        z.object({
          organization: OrganizationSchema.get,
          team: TeamSchema.get,
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const responseOrg = await repository.create(input, ctx.headers);
        const responseTeam = await teamRepository.create({
          name: "Default Team",
          description: "Default team for the organization",
          organizationId: responseOrg.id,
          visibility: "public",
          createdBy: responseOrg.id,
        });

        return {
          organization: responseOrg,
          team: responseTeam,
        };
      }),
  });
}
