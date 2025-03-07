import {
  OrganizationMemberSchema,
  OrganizationSchema,
  TeamSchema,
} from "@repo/types";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { TeamRepository } from "../team/team.repository";
import { z } from "zod";
import { OrganizationBetterAuthImplV2 } from "./organization.repository.v2";
import { auth } from "../auth";

const organizationProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const repository = new OrganizationBetterAuthImplV2(auth, ctx.headers);
  return next({
    ctx: {
      ...ctx,
      orgRepository: repository,
    },
  });
});

export interface OrganizationControllerProps {
  teamRepository: TeamRepository;
}

export function addOrganizationRoutes({
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
        const responseOrg = await ctx.orgRepository.create(input);
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
        const response = await ctx.orgRepository.update(input);
        return response;
      }),
    delete: organizationProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.delete(input.id);
        return;
      }),
    addMember: organizationProcedure
      .input(OrganizationMemberSchema.addMember)
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.addMember(input);
        return;
      }),
    changeMemberRole: organizationProcedure
      .input(OrganizationMemberSchema.changeRole)
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.changeMemberRole(input);
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
        const result = await ctx.orgRepository.getMembers(input);
        return {
          organizationId: input.organizationId,
          users: result,
        };
      }),
    removeMember: organizationProcedure
      .input(OrganizationMemberSchema.removeMember)
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.removeMember(input);
        return;
      }),
  });
}
