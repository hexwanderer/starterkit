import { db, organizations } from "@repo/database"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, organization } from "better-auth/plugins";

console.log(`BETTER_AUTH_SECRET: ${process.env.BETTER_AUTH_SECRET}`);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    usePlural: true,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
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
  plugins: [organization(), bearer()],
});

export type AuthService = typeof auth;
