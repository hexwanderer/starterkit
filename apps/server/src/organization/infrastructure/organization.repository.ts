import type { auth } from "../../shared/state/auth";
import type {
  OrganizationCreate,
  OrganizationGet,
} from "../domain/organization.type";

export interface OrganizationRepository {
  create(organization: OrganizationCreate): Promise<OrganizationGet>;
}

export class OrganizationBetterAuthImpl implements OrganizationRepository {
  client: typeof auth;

  constructor(client: typeof auth) {
    this.client = client;
  }

  async create(organization: OrganizationCreate): Promise<OrganizationGet> {
    const organizationResult = await this.client.api.createOrganization({
      body: {
        name: organization.name,
        slug: organization.slug,
      },
    });
    if (organizationResult == null || organizationResult === undefined) {
      throw new Error("Failed to create organization");
    }

    if (
      !organizationResult.members ||
      organizationResult.members.length === 0
    ) {
      throw new Error("No members found");
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
  }
}
