import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { getScalarUI } from "./openapi-ui";
import { pool } from "../db/pool";

export const app = new Hono().basePath('/api');

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", async (c) => {
  let dbStatus = "disconnected";
  
  try {
    const res = await pool.query("SELECT 1");
    if (res.rowCount === 1) {
      dbStatus = "connected";
    }
  } catch (error) {
    console.error("Database health check failed:", error);
  }

  return c.json({
    success: true,
    data: {
      status: "ok",
      db_status: dbStatus,
      service: "careerbridge-api",
      timestamp: new Date().toISOString(),
    },
  });
});

// ─── OpenAPI spec endpoint ───────────────────────────────────────────────────
app.get(
  "/doc",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "CareerBridge API",
        version: "1.0.0",
        description: "REST API for CareerBridge platform.",
      },
    }
  })
);

// ─── Scalar API reference UI ─────────────────────────────────────────────────
app.get("/reference", (c) => {
  const specUrl = new URL("/api/doc", new URL(c.req.url).origin).toString();
  return c.html(getScalarUI(specUrl));
});
