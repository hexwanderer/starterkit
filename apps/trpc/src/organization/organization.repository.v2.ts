import type { auth } from "../auth";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  inferSchema,
  organizationMemberSchema,
  organizationSchema,
} from "@repo/types";

export const organizationOps = {
  list: inferSchema(z.string(), z.array(organizationSchema)),
  get: inferSchema(z.string(), z.nullable(organizationSchema)),
  create: inferSchema(
    organizationSchema.omit({ id: true }),
    organizationSchema.merge(
      z.object({
        members: z.array(
          organizationMemberSchema.pick({ id: true, userId: true, role: true }),
        ),
      }),
    ),
  ),
  update: inferSchema(
    organizationSchema.partial({ name: true, slug: true }),
    organizationSchema,
  ),
  delete: inferSchema(z.string(), z.void()),
};

export const organizationMemberOps = {
  add: inferSchema(
    z.object({
      organizationId: z.string(),
      email: z.string(),
    }),
    z.void(),
  ),
  remove: inferSchema(
    z.object({
      organizationId: z.string().min(1),
      userId: z.string().min(1),
    }),
    z.void(),
  ),
  get: inferSchema(z.string(), z.array(organizationMemberSchema)),
  changeRole: inferSchema(
    z.object({ memberId: z.string(), role: z.string() }),
    z.void(),
  ),
};

export interface OrganizationRepository {
  get(
    params: z.infer<typeof organizationOps.get.input>,
  ): Promise<z.infer<typeof organizationOps.get.output>>;

  create(
    organization: z.infer<typeof organizationOps.create.input>,
  ): Promise<z.infer<typeof organizationOps.create.output>>;

  update(
    organization: z.infer<typeof organizationOps.update.input>,
  ): Promise<z.infer<typeof organizationOps.update.output>>;

  delete(
    organization: z.infer<typeof organizationOps.delete.input>,
  ): Promise<z.infer<typeof organizationOps.delete.output>>;

  addMember(
    params: z.infer<typeof organizationMemberOps.add.input>,
  ): Promise<z.infer<typeof organizationMemberOps.add.output>>;

  removeMember(
    params: z.infer<typeof organizationMemberOps.remove.input>,
  ): Promise<z.infer<typeof organizationMemberOps.remove.output>>;

  getMembers(
    params: z.infer<typeof organizationMemberOps.get.input>,
  ): Promise<z.infer<typeof organizationMemberOps.get.output>>;

  changeMemberRole(
    params: z.infer<typeof organizationMemberOps.changeRole.input>,
  ): Promise<z.infer<typeof organizationMemberOps.changeRole.output>>;
}

export class OrganizationBetterAuthImplV2 implements OrganizationRepository {
  client: typeof auth;
  headers: Headers;

  constructor(client: typeof auth, headers: Headers) {
    this.client = client;
    this.headers = headers;
  }

  async delete(
    organization: z.infer<typeof organizationOps.delete.input>,
  ): Promise<z.infer<typeof organizationOps.delete.output>> {
    await this.client.api.deleteOrganization({
      body: {
        organizationId: organization,
      },
      headers: this.headers,
    });
    return;
  }

  async create(
    organization: z.infer<typeof organizationOps.create.input>,
  ): Promise<z.infer<typeof organizationOps.create.output>> {
    try {
      const organizationResult = await this.client.api.createOrganization({
        body: {
          name: organization.name,
          slug: organization.slug,
        },
        headers: this.headers,
      });
      if (organizationResult == null || organizationResult === undefined) {
        throw new Error("Failed to create organization");
      }

      return {
        id: organizationResult.id,
        name: organizationResult.name,
        slug: organizationResult.slug,
        members: organizationResult.members.map((member) => ({
          id: member.id ?? "",
          userId: member.userId,
          role: member.role,
        })),
      };
    } catch (err) {
      throw new Error("Failed to create organization");
    }
  }

  async get(
    params: z.infer<typeof organizationOps.get.input>,
  ): Promise<z.infer<typeof organizationOps.get.output>> {
    return this.client.api.getFullOrganization({
      query: {
        organizationId: params,
      },
      headers: this.headers,
    });
  }

  async update(
    organization: z.infer<typeof organizationOps.update.input>,
  ): Promise<z.infer<typeof organizationOps.update.output>> {
    try {
      const organizationResult = await this.client.api.updateOrganization({
        body: {
          data: {
            name: organization.name,
            slug: organization.slug,
          },
        },
        headers: this.headers,
      });
      if (organizationResult == null || organizationResult === undefined) {
        throw new Error("Failed to update organization");
      }

      return {
        id: organizationResult.id,
        name: organizationResult.name,
        slug: organizationResult.slug,
      };
    } catch (err) {
      throw new Error("Failed to update organization");
    }
  }

  async addMember(
    params: z.infer<typeof organizationMemberOps.add.input>,
  ): Promise<z.infer<typeof organizationMemberOps.add.output>> {
    await this.client.api.createInvitation({
      body: {
        organizationId: params.organizationId,
        role: "member",
        email: params.email,
      },
      headers: this.headers,
    });
    return;
  }

  async removeMember(
    params: z.infer<typeof organizationMemberOps.remove.input>,
  ): Promise<z.infer<typeof organizationMemberOps.remove.output>> {
    await this.client.api.removeMember({
      body: {
        organizationId: params.organizationId,
        memberIdOrEmail: params.userId,
      },
    });
    return;
  }

  async getMembers(
    params: z.infer<typeof organizationMemberOps.get.input>,
  ): Promise<z.infer<typeof organizationMemberOps.get.output>> {
    const org = await this.client.api.getFullOrganization({
      query: {
        organizationId: params,
      },
      headers: this.headers,
    });
    if (!org) throw new TRPCError({ code: "NOT_FOUND" });
    return org.members.map((member) => ({
      id: member.id,
      organizationId: member.organizationId,
      organization: {
        name: org.name,
        slug: org.slug,
      },
      userId: member.userId,
      user: {
        name: member.user.name,
        email: member.user.email,
      },
      role: member.role,
      createdAt: member.createdAt.toISOString(),
    }));
  }

  async changeMemberRole(
    params: z.infer<typeof organizationMemberOps.changeRole.input>,
  ): Promise<z.infer<typeof organizationMemberOps.changeRole.output>> {
    await this.client.api.updateMemberRole({
      body: {
        memberId: params.memberId,
        role: params.role as "owner" | "admin" | "member",
      },
    });
  }
}
