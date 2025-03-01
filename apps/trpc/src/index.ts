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
import { SocketServer } from "./socket";
import { createServer } from "node:http";
import { NotificationPostgresImpl } from "./notification/notification.repository";
import type { NotificationSchemaCreate } from "@repo/types";

console.log(`REDIS_HOST: ${process.env.REDIS_HOST}`);

const PORT = 7506;
const teamRepository = new TeamPostgresImpl(db);
const notificationRepository = new NotificationPostgresImpl(db);

const client = new IORedis(
  `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
);
const resourceQueue = new Queue("resource-queue", { connection: client });
const proxyServer = proxy.createProxyServer();
const proxyRouter = express.Router();

proxyRouter.use("/collect/static", (req, res) => {
  proxyServer.web(req, res, {
    target: "https://eu-assets.i.posthog.com/static",
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
    target: "https://eu.i.posthog.com",
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

// Create Express app with all middleware and routes
const app = express()
  .use(cors())
  .use(proxyRouter)
  .all("/api/auth/*", toNodeHandler(auth));

// Create HTTP server from Express app
const httpServer = createServer(app);

// Set up Socket.IO with the HTTP server
const ss = new SocketServer();
await ss.initializeSocketIO(httpServer, client, notificationRepository);

// Define and set up tRPC router
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
    socket: ss,
  }),
  index: publicProcedure.query(async () => {
    return "OK";
  }),
});

export type AppRouter = typeof appRouter;

// Add tRPC middleware to Express app
app
  .use(
    "/api",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext: createContext,
    }),
  )
  .use(express.json())
  .post("/test-notification", async (req, res) => {
    const body = req.body as NotificationSchemaCreate;
    notificationRepository.create(body);
    console.log("test-notification");
    await ss.notifyUser(req.body.userId, req.body.data);
    res.sendStatus(200);
  });

// Start the HTTP server
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
