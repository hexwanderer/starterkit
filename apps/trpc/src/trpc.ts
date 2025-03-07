import { initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import { auth } from "./auth";
import { fromNodeHeaders } from "better-auth/node";
import type { OrganizationRepository } from "./organization/organization.repository.v2";
import { RoleMappings, type RequestorContext } from "@repo/types";
import { db, members, organizations, teamMembers, teams } from "@repo/database";
import { eq } from "drizzle-orm";

type Context = {
  user?: RequestorContext;
  orgRepository?: OrganizationRepository;
  headers: Headers;
};

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions): Promise<Context> => {
  if (req.get("Authorization")) {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session) {
      const [dbRole] = await db
        .select({
          role: members.role,
        })
        .from(members)
        .leftJoin(organizations, eq(members.organizationId, organizations.id))
        .where(eq(members.userId, session.user.id))
        .limit(1);
      const rolesArray = RoleMappings[dbRole.role ?? "user"];

      const teamsList = await db
        .select({
          id: teamMembers.id,
        })
        .from(teams)
        .where(
          eq(teams.organizationId, session.session.activeOrganizationId ?? ""),
        )
        .execute();

      return {
        user: {
          user: session.user,
          organization: {
            id: session.session.activeOrganizationId ?? "",
            roles: rolesArray,
          },
          teams: teamsList.map((team) => team.id),
          session: session.session,
        },
        headers: fromNodeHeaders(req.headers),
      };
    }
  }
  return {
    headers: fromNodeHeaders(req.headers),
  };
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
