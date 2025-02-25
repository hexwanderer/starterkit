import { fromNodeHeaders } from "better-auth/node";
import type { auth } from "../auth";
import type {
  OrganizationCreate,
  OrganizationGet,
  OrganizationMemberAdd,
  OrganizationMemberGet,
  OrganizationMemberQueryGetMembers,
  OrganizationMemberRemove,
  OrganizationUpdate,
} from "@repo/types";
import { TRPCError } from "@trpc/server";

export interface OrganizationRepository {
  create(
    organization: OrganizationCreate,
    headers?: Headers,
  ): Promise<OrganizationGet>;

  update(
    organization: OrganizationUpdate,
    headers?: Headers,
  ): Promise<OrganizationGet>;

  delete(id: string, headers?: Headers): Promise<void>;

  addMember(params: OrganizationMemberAdd, headers?: Headers): Promise<void>;

  getMembers(
    params: OrganizationMemberQueryGetMembers,
    headers?: Headers,
  ): Promise<OrganizationMemberGet[]>;

  removeMember(
    params: OrganizationMemberRemove,
    headers?: Headers,
  ): Promise<void>;
}

export class OrganizationBetterAuthImpl implements OrganizationRepository {
  client: typeof auth;

  constructor(client: typeof auth) {
    this.client = client;
  }

  async getMembers(
    params: OrganizationMemberQueryGetMembers,
    headers?: Headers,
  ): Promise<OrganizationMemberGet[]> {
    if (!headers) throw new Error("No headers provided");
    const org = await this.client.api.getFullOrganization({
      headers,
      query: {
        organizationId: params.organizationId,
      },
    });
    if (!org) throw new TRPCError({ code: "NOT_FOUND" });
    return org.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.role,
    }));
  }

  async addMember(
    params: OrganizationMemberAdd,
    headers?: Headers,
  ): Promise<void> {
    if (!headers) throw new Error("No headers provided");
    const x = await this.client.api.createInvitation({
      headers,
      body: {
        organizationId: params.organizationId,
        role: "member",
        email: params.email,
      },
    });
    return;
  }

  async removeMember(
    params: OrganizationMemberRemove,
    headers?: Headers,
  ): Promise<void> {
    if (!headers) throw new Error("No headers provided");
    await this.client.api.removeMember({
      headers,
      body: {
        organizationId: params.organizationId,
        memberIdOrEmail: params.userId,
      },
    });
    return;
  }

  async create(
    organization: OrganizationCreate,
    headers?: Headers,
  ): Promise<OrganizationGet> {
    try {
      if (!headers) throw new Error("No headers provided");
      const organizationResult = await this.client.api.createOrganization({
        headers,
        body: {
          name: organization.name,
          slug: organization.slug,
        },
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
        })),
      };
    } catch (err) {
      throw new Error("Failed to create organization");
    }
  }

  async update(
    organization: OrganizationUpdate,
    headers?: Headers,
  ): Promise<OrganizationGet> {
    try {
      if (!headers) throw new Error("No headers provided");
      const organizationResult = await this.client.api.updateOrganization({
        headers,
        body: {
          data: {
            name: organization.name,
            slug: organization.slug,
          },
        },
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

  async delete(id: string, headers?: Headers): Promise<void> {
    if (!headers) throw new Error("No headers provided");
    await this.client.api.deleteOrganization({
      headers,
      body: {
        organizationId: id,
      },
    });
    return;
  }
}
