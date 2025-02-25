import { initTRPC } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import express from "express";
import { auth } from "./auth";
import { fromNodeHeaders } from "better-auth/node";
import type { Session, User } from "better-auth";

type Context = {
  user?: User;
  session?: Session;
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
      return {
        user: session.user,
        session: session.session,
      };
    }
  }
  return {};
};

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
