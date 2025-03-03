import {
  OrganizationMemberSchema,
  OrganizationSchema,
  TeamSchema,
} from "@repo/types";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { OrganizationRepository } from "./organization.repository";
import type { TeamRepository } from "../team/team.repository";
import { z } from "zod";

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
          slug: "my-team",
          organizationId: responseOrg.id,
          visibility: "public",
          createdBy: responseOrg.id,
        });

        return {
          organization: responseOrg,
          team: responseTeam,
        };
      }),
    edit: organizationProcedure
      .input(OrganizationSchema.update)
      .output(OrganizationSchema.get)
      .mutation(async ({ input, ctx }) => {
        const response = await repository.update(input, ctx.headers);
        return response;
      }),
    delete: organizationProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await repository.delete(input.id, ctx.headers);
        return;
      }),
    addMember: organizationProcedure
      .input(OrganizationMemberSchema.addMember)
      .mutation(async ({ input, ctx }) => {
        await repository.addMember(input, ctx.headers);
        return;
      }),
    changeMemberRole: organizationProcedure
      .input(OrganizationMemberSchema.changeRole)
      .mutation(async ({ input, ctx }) => {
        await repository.changeMemberRole(input, ctx.headers);
        return;
      }),
    getMembers: organizationProcedure
      .input(z.object({ organizationId: z.string() }))
      .output(
        z.object({
          organizationId: z.string(),
          users: z.array(OrganizationMemberSchema.get),
        }),
      )
      .query(async ({ input, ctx }) => {
        const result = await repository.getMembers(input, ctx.headers);
        return {
          organizationId: input.organizationId,
          users: result,
        };
      }),
    removeMember: organizationProcedure
      .input(OrganizationMemberSchema.removeMember)
      .mutation(async ({ input, ctx }) => {
        await repository.removeMember(input, ctx.headers);
        return;
      }),
  });
}
