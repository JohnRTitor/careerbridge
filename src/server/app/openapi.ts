import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

export function setupOpenAPI(app: Hono) {
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
              bearerFormat: "JWT",
            },
          },
        },
      },
    })
  );

  // ─── Scalar API reference UI ─────────────────────────────────────────────────
  app.get("/reference", (c) => {
    const specUrl = new URL("/api/doc", new URL(c.req.url).origin).toString();
    return c.html(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CareerBridge API - Documentation</title>
    <meta name="description" content="Interactive API documentation for CareerBridge" />
  </head>
  <body>
    <script
      id="api-reference"
      data-url="${specUrl}"
      data-configuration='${JSON.stringify({
        theme: "kepler",
        layout: "modern",
        hideDownloadButton: false,
        metaData: {
          title: "CareerBridge API",
          description: "Complete REST API documentation for CareerBridge.",
        },
      })}'
    ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`);
  });
}
