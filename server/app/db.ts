import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Ensure it exists in the root .env");
}

export const pool = new Pool({
  connectionString: databaseUrl,
});
