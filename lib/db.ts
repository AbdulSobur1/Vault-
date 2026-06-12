import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Please add it to your environment variables " +
    "(locally in .env.local, on Vercel via Project Settings > Environment Variables)."
  );
}

const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
