import {
  organizationMemberSchema,
  organizationSchema,
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
      .input(organizationSchema.omit({ id: true }))
      .output(
        z.object({
          organization: organizationSchema,
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
      .input(organizationSchema.partial({ name: true, slug: true }))
      .output(organizationSchema)
      .mutation(async ({ input, ctx }) => {
        const response = await ctx.orgRepository.update(input);
        return response;
      }),
    delete: organizationProcedure
      .input(organizationSchema.pick({ id: true }))
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.delete(input.id);
        return;
      }),
    addMember: organizationProcedure
      .input(
        z.object({
          organizationId: z.string(),
          email: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.addMember(input);
        return;
      }),
    changeMemberRole: organizationProcedure
      .input(z.object({ memberId: z.string(), role: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.changeMemberRole(input);
        return;
      }),
    getMembers: organizationProcedure
      .input(z.object({ organizationId: z.string() }))
      .output(z.array(organizationMemberSchema))
      .query(async ({ input, ctx }) => {
        const result = await ctx.orgRepository.getMembers(input.organizationId);
        return result;
      }),
    removeMember: organizationProcedure
      .input(
        z.object({
          organizationId: z.string().min(1),
          userId: z.string().min(1),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        await ctx.orgRepository.removeMember(input);
        return;
      }),
  });
}
