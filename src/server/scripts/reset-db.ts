import { pool } from "../app/db";
import fs from "fs";
import path from "path";

async function resetDb() {
  console.log("🧹 Resetting database...");
  try {
    // 1. Drop and recreate schema
    console.log("Dropping schema public...");
    await pool.query("DROP SCHEMA public CASCADE;");
    await pool.query("CREATE SCHEMA public;");

    // 2. Read and execute schema.sql
    console.log("Applying schema.sql...");
    const schemaPath = path.resolve(process.cwd(), "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");
    await pool.query(schemaSql);
    
    console.log("✅ Database reset successfully!");
  } catch (error) {
    console.error("❌ Failed to reset database:", error);
    process.exit(1);
  } finally {
    // Note: Do not close pool here if we are chaining this with seed.ts in a single process, 
    // but typically we run this as a standalone script.
    await pool.end();
  }
}

resetDb();
