import { fromNodeHeaders } from "better-auth/node";
import type { auth } from "../auth";
import type {
  OrganizationCreate,
  OrganizationGet,
  OrganizationUpdate,
} from "@repo/types";

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
}

export class OrganizationBetterAuthImpl implements OrganizationRepository {
  client: typeof auth;

  constructor(client: typeof auth) {
    this.client = client;
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
