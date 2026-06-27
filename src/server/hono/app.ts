import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { getScalarUI } from "./openapi-ui";

export const app = new Hono().basePath('/api');

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/health", (c) => {
  return c.json({
    success: true,
    data: {
      status: "ok",
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
