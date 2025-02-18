import { ac, admin, member, owner } from "@repo/auth";
import { db } from "@repo/database"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    usePlural: true,
  }),
  trustedOrigins: ["http://localhost:3001"],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request,
      ) => {
        console.log("sendChangeEmailVerification", user, newEmail, url, token);
      },
    },
  },
  plugins: [
    organization({
      ac: ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),
  ],
});

export type AuthService = typeof auth;
