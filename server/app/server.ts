import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { setupOpenAPI } from "./openapi";
import { fail } from "../shared/responses";
import { AppError } from "../shared/errors";
import { pool } from "./db";

import { profilesRoutes } from "../features/profiles/profiles.routes";
import { jobsRoutes } from "../features/jobs/jobs.routes";
import {
  applicationsRoutes,
  jobApplicationsRoutes,
} from "../features/applications/applications.routes";
import { recruitersRoutes } from "../features/recruiters/recruiters.routes";
import { companiesRoutes } from "../features/companies/companies.routes";
import { adminRoutes } from "../features/admin/admin.routes";
import { metaRoutes } from "../features/meta/meta.routes";
import { statsRoutes } from "../features/stats/stats.routes";
import { auth } from "../auth/auth";

export const app = new Hono().basePath("/api");

// ─── Auth Route ──────────────────────────────────────────────────────────────
app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

// ─── Feature Routes ──────────────────────────────────────────────────────────
const routes = app
  .route("/users", profilesRoutes)
  .route("/jobs", jobsRoutes)
  .route("/jobs", jobApplicationsRoutes)
  .route("/applications", applicationsRoutes)
  .route("/recruiters", recruitersRoutes)
  .route("/companies", companiesRoutes)
  .route("/admin", adminRoutes)
  .route("/meta", metaRoutes)
  .route("/stats", statsRoutes);

export type AppType = typeof routes;

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

// ─── OpenAPI Setup ───────────────────────────────────────────────────────────
setupOpenAPI(app);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.notFound((c) => {
  return fail(c, 404, "Route not found", "NOT_FOUND");
});

// ─── Centralized error handler ───────────────────────────────────────────────
app.onError((err, c) => {
  if (err instanceof AppError) {
    return fail(c, err.status, err.message, err.code, err.details);
  }

  if (err instanceof HTTPException) {
    const status = err.status ?? 500;
    return fail(c, status, err.message || "Request failed", "HTTP_EXCEPTION");
  }

  if (err.name === "ZodError") {
    return fail(
      c,
      400,
      "Validation failed",
      "VALIDATION_ERROR",
      (err as ZodError).issues,
    );
  }

  console.error("Unhandled error:", err);
  return fail(
    c,
    500,
    err instanceof Error ? err.message : "Internal server error",
    "INTERNAL_SERVER_ERROR",
  );
});
