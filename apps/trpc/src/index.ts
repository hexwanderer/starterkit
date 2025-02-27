import { createContext, publicProcedure, router } from "./trpc";
import * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import proxy from "http-proxy";
import { addResourceRoutes } from "./resource/resource.controller";
import { ResourcePostgresImpl } from "./resource/resource.repository";
import { db, teamMembers } from "@repo/database";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import { addOrganizationRoutes } from "./organization/organization.controller";
import { OrganizationBetterAuthImpl } from "./organization/organization.repository";
import { addTeamRoutes } from "./team/team.controller";
import { TeamPostgresImpl } from "./team/team.repository";
import { Queue } from "bullmq";
import IORedis from "ioredis";

console.log(`REDIS_HOST: ${process.env.REDIS_HOST}`);

const teamRepository = new TeamPostgresImpl(db);

const client = new IORedis(
  `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
);

const resourceQueue = new Queue("resource-queue", { connection: client });

const appRouter = router({
  resource: addResourceRoutes({
    repository: new ResourcePostgresImpl(db),
    queue: resourceQueue,
  }),
  organization: addOrganizationRoutes({
    repository: new OrganizationBetterAuthImpl(auth),
    teamRepository,
  }),
  team: addTeamRoutes({
    repository: teamRepository,
  }),
  index: publicProcedure.query(async () => {
    return "OK";
  }),
});

export type AppRouter = typeof appRouter;

const proxyServer = proxy.createProxyServer();
const proxyRouter = express.Router();

proxyRouter.use("/collect/static", (req, res) => {
  proxyServer.web(req, res, {
    target: "https://us-assets.i.posthog.com/static",
    changeOrigin: true,
    secure: true,
    xfwd: true,
    headers: {
      "X-Real-IP": req.ip ?? "",
      "X-Forwarded-For": req.ip ?? "",
      "X-Forwarded-Host": req.hostname,
    },
  });
});

proxyRouter.use("/collect", (req, res) => {
  proxyServer.web(req, res, {
    target: "https://us.i.posthog.com",
    changeOrigin: true,
    secure: true,
    xfwd: true,
    headers: {
      "X-Real-IP": req.ip ?? "",
      "X-Forwarded-For": req.ip ?? "",
      "X-Forwarded-Host": req.hostname,
    },
  });
});

const app = express()
  .use(cors())
  .use(proxyRouter)
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
