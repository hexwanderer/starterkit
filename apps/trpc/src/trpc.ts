import { initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import { auth } from "./auth";
import { fromNodeHeaders } from "better-auth/node";
import type { OrganizationRepository } from "./organization/organization.repository.v2";
import { RoleMappings, type RequestorContext } from "@repo/types";
import { db, members, organizations, teamMembers, teams } from "@repo/database";
import { eq } from "drizzle-orm";
import type { ResourceRepository } from "./resource/resource.repository";

type Context = {
  user?: RequestorContext;
  orgRepository?: OrganizationRepository;
  resourceRepository?: ResourceRepository;
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
      const [[dbRole], teamsList] = await Promise.all([
        db
          .select({
            role: members.role,
          })
          .from(members)
          .leftJoin(organizations, eq(members.organizationId, organizations.id))
          .where(eq(members.userId, session.user.id))
          .limit(1),
        db
          .select({
            id: teamMembers.id,
          })
          .from(teamMembers)
          .where(eq(teamMembers.userId, session.user.id ?? ""))
          .execute(),
      ]);
      const rolesArray = RoleMappings[dbRole.role ?? "user"];
      console.log(`dbrole: ${dbRole.role}, rolesArray: ${rolesArray}`);

      return {
        user: {
          user: session.user,
          organization: {
            id: session.session.activeOrganizationId ?? "",
            roles: rolesArray,
          },
          teams: teamsList,
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
