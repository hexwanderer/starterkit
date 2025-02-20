import { Elysia, t } from "elysia";
import { auth } from "../../shared/state/auth";
import { OrganizationSchema } from "../domain/organization.type";
import { OrganizationBetterAuthImpl } from "./organization.repository";
import { TeamPostgresImpl } from "../../team/infrastructure/team.repository";
import { db } from "@repo/database";
import { TeamSchema } from "../../team";

export const OrganizationControllerSetup = new Elysia({
  prefix: "/organizations",
}).decorate({
  repository: new OrganizationBetterAuthImpl(auth),
  teamRepository: new TeamPostgresImpl(db),
});

export function addOrganizationRoutes(app: typeof OrganizationControllerSetup) {
  return app.put(
    "/",
    async ({ repository, teamRepository, body, error }) => {
      try {
        const responseOrg = await repository.create(body);
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
      } catch (e) {
        return error(500, "Internal server error");
      }
    },
    {
      body: OrganizationSchema.create,
      response: {
        200: t.Object({
          organization: OrganizationSchema.get,
          team: TeamSchema.get,
        }),
        500: t.String(),
      },
    },
  );
}

export const OrganizationController = addOrganizationRoutes(
  OrganizationControllerSetup,
);
