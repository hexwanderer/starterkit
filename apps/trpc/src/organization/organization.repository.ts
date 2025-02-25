import { fromNodeHeaders } from "better-auth/node";
import type { auth } from "../auth";
import type { OrganizationCreate, OrganizationGet } from "@repo/types";

export interface OrganizationRepository {
  create(
    organization: OrganizationCreate,
    headers: Headers,
  ): Promise<OrganizationGet>;
}

export class OrganizationBetterAuthImpl implements OrganizationRepository {
  client: typeof auth;

  constructor(client: typeof auth) {
    this.client = client;
  }

  async create(
    organization: OrganizationCreate,
    headers: Headers,
  ): Promise<OrganizationGet> {
    try {
      const organizationResult = await this.client.api.createOrganization({
        headers: headers,
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
    } catch (e) {
      throw new Error("Failed to create organization");
    }
  }
}
