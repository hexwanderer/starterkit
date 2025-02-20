import { Elysia, t } from "elysia";
import { TeamPostgresImpl } from "./team.repository";
import { db } from "@repo/database";
import { auth } from "../../shared/state/auth";
import { hasPermission, type Role } from "@repo/auth";
import { TeamSchema } from "../domain/team.type";

export const TeamController = new Elysia({ prefix: "/teams" })
  .decorate({
    repository: new TeamPostgresImpl(db),
  })
  .derive(async ({ request }) => {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session || !session.user || !session.session) {
      return {
        user: null,
        session: null,
      };
    }

    const organizationId = session.session.activeOrganizationId;
    if (!organizationId) {
      return {
        user: {
          ...session.user,
          roles: [] as Role[],
        },
        session: session.session,
      };
    }

    const member = await auth.api.getActiveMember();
    if (!member) {
      return {
        user: {
          ...session.user,
          roles: [] as Role[],
        },
        session: session.session,
      };
    }

    return {
      user: {
        ...session.user,
        roles: [member?.role] as Role[],
      },
      session: session.session,
    };
  })
  .get(
    "/",
    async ({ repository, user, session, error }) => {
      try {
        if (!user || !user.roles || !session.activeOrganizationId) {
          return error(401, "Unauthorized");
        }
        if (!hasPermission(user, "team", "view")) {
          error(401, "Unauthorized");
        }
        const response = await repository.getAll({
          filter: {
            organizationId: session.activeOrganizationId,
          },
        });
        return {
          data: response,
        };
      } catch (e) {
        return error(500, "Internal server error");
      }
    },
    {
      response: {
        200: t.Object({
          data: t.Array(TeamSchema.get),
        }),
        401: t.String(),
        500: t.String(),
      },
    },
  )
  .get(
    "/:id",
    async ({ repository, params: { id }, user, session, body, error }) => {
      try {
        if (!user || !user.roles || !session.activeOrganizationId) {
          return error(401, "Unauthorized");
        }
        const response = await repository.getById(id);
        if (!response) {
          return error(404, "Team not found");
        }
        if (!hasPermission(user, "team", "view", response)) {
          error(401, "Unauthorized");
        }
        return response;
      } catch (e) {
        return error(500, "Internal server error");
      }
    },
  );
