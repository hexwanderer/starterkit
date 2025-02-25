import { createContext, publicProcedure, router } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { addResourceRoutes } from "./resource/resource.controller";
import { ResourcePostgresImpl } from "./resource/resource.repository";
import { db } from "@repo/database";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { addOrganizationRoutes } from "./organization/organization.controller";
import { OrganizationBetterAuthImpl } from "./organization/organization.repository";

const appRouter = router({
  resource: addResourceRoutes({
    repository: new ResourcePostgresImpl(db),
  }),
  organization: addOrganizationRoutes({
    repository: new OrganizationBetterAuthImpl(auth),
  }),
  index: publicProcedure.query(async () => {
    return "OK";
  }),
});

export type AppRouter = typeof appRouter;

const app = express()
  .use(cors())
  .all("/api/auth/*", toNodeHandler(auth))
  .use(
    "/api",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: createContext,
    }),
  )
  .listen(7506, () => {
    console.log("trpc is running at http://localhost:7506");
  });
