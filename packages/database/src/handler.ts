import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

config({ path: "../../.env" });

console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);

const client = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(client, { schema });

export type DatabaseHandler = typeof db;
