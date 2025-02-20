import { cors } from "@elysiajs/cors";
import { db } from "@repo/database";
import { type Context, Elysia } from "elysia";
import { ResourceController } from "./resource/infrastructure/resource.controller";
import { auth } from "./shared/state/auth";
import { OrganizationController } from "./organization/infrastructure/organization.controller";
import { TeamController } from "./team/infrastructure/team.controller";

console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

async function betterAuthMiddleware(context: Context) {
  return await auth.handler(context.request);
}

export const state = {
  db,
};

export const app = new Elysia({ prefix: "/api" })
  .state(state)
  .use(cors())
  .all("/*", ({ request }) => {
    console.log("request", request);
  })
  .all("/auth/*", betterAuthMiddleware)
  .use(ResourceController)
  .use(OrganizationController)
  .use(TeamController)
  .get("/", () => "Hello Elysia")
  .listen(
    {
      port: 7505,
      hostname: "127.0.0.1",
    },
    ({ hostname, port }) => {
      console.log(`🦊 Elysia is running at ${hostname}:${port}`);
    },
  );

export type App = typeof app;

export type { ResourceGet } from "./resource";
export type { OrganizationGet, OrganizationCreate } from "./organization";
