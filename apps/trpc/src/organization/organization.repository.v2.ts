import type { auth } from "../auth";
import type {
  OrganizationCreate,
  OrganizationGet,
  OrganizationMemberAdd,
  OrganizationMemberChangeRole,
  OrganizationMemberGet,
  OrganizationMemberQueryGetMembers,
  OrganizationMemberRemove,
  OrganizationUpdate,
} from "@repo/types";
import { TRPCError } from "@trpc/server";

export interface OrganizationRepository {
  create(organization: OrganizationCreate): Promise<OrganizationGet>;
  update(organization: OrganizationUpdate): Promise<OrganizationGet>;
  changeMemberRole(params: OrganizationMemberChangeRole): Promise<void>;
  getMembers(
    params: OrganizationMemberQueryGetMembers,
  ): Promise<OrganizationMemberGet[]>;
  removeMember(params: OrganizationMemberRemove): Promise<void>;
}

export class OrganizationBetterAuthImplV2 implements OrganizationRepository {
  client: typeof auth;
  headers: Headers;

  constructor(client: typeof auth, headers: Headers) {
    this.client = client;
    this.headers = headers;
  }

  async changeMemberRole(params: OrganizationMemberChangeRole): Promise<void> {
    if (!params.role || !["owner", "admin", "member"].includes(params.role)) {
      throw new Error("Invalid role");
    }
    await this.client.api.updateMemberRole({
      body: {
        memberId: params.memberId,
        role: params.role as "owner" | "admin" | "member",
      },
    });
  }

  async getMembers(
    params: OrganizationMemberQueryGetMembers,
  ): Promise<OrganizationMemberGet[]> {
    const org = await this.client.api.getFullOrganization({
      query: {
        organizationId: params.organizationId,
      },
      headers: this.headers,
    });
    if (!org) throw new TRPCError({ code: "NOT_FOUND" });
    return org.members.map((member) => ({
      id: member.userId,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
    }));
  }

  async addMember(params: OrganizationMemberAdd): Promise<void> {
    const x = await this.client.api.createInvitation({
      body: {
        organizationId: params.organizationId,
        role: "member",
        email: params.email,
      },
      headers: this.headers,
    });
    return;
  }

  async removeMember(params: OrganizationMemberRemove): Promise<void> {
    await this.client.api.removeMember({
      body: {
        organizationId: params.organizationId,
        memberIdOrEmail: params.userId,
      },
    });
    return;
  }

  async create(organization: OrganizationCreate): Promise<OrganizationGet> {
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
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
          role: member.role,
        })),
      };
    } catch (err) {
      throw new Error("Failed to create organization");
    }
  }

  async update(organization: OrganizationUpdate): Promise<OrganizationGet> {
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
        members: [],
      };
    } catch (err) {
      throw new Error("Failed to update organization");
    }
  }

  async delete(id: string): Promise<void> {
    await this.client.api.deleteOrganization({
      body: {
        organizationId: id,
      },
      headers: this.headers,
    });
    return;
  }
}
