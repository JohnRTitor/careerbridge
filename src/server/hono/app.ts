import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { getScalarUI } from "./openapi-ui";
import { pool } from "../db/pool";
import { HTTPException } from "hono/http-exception";
import { fail } from "../utils/response";
import { userRoutes } from "../modules/user/user.routes";
import { jobRoutes } from "../modules/job/job.routes";

export const app = new Hono().basePath('/api');

// ─── Mount module routes ─────────────────────────────────────────────────────
app.route("/users", userRoutes);
app.route("/jobs", jobRoutes);

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
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    }
  })
);

// ─── Scalar API reference UI ─────────────────────────────────────────────────
app.get("/reference", (c) => {
  const specUrl = new URL("/api/doc", new URL(c.req.url).origin).toString();
  return c.html(getScalarUI(specUrl));
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.notFound((c) => {
  return c.json(fail("Route not found", { code: "NOT_FOUND" }), 404);
});

// ─── Centralized error handler ───────────────────────────────────────────────
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const status = err.status ?? 500;
    return c.json(
      fail(err.message || "Request failed", {
        code: "HTTP_EXCEPTION",
      }),
      status
    );
  }

  if (err.name === 'ZodError') {
    return c.json(
      fail("Validation failed", {
        code: "VALIDATION_ERROR",
        details: (err as { issues?: unknown }).issues,
      }),
      400
    );
  }

  console.error("Unhandled error:", err);
  return c.json(
    fail(err instanceof Error ? err.message : "Internal server error", {
      code: "INTERNAL_SERVER_ERROR",
    }),
    500
  );
});
