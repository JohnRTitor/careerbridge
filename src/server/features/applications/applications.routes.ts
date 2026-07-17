import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requireCandidate, requirePermission } from "../../app/middleware/authorize";
import { applicationsService } from "./applications.service";
import { ApplyJobSchema } from "./applications.schemas";
import { ok, created, noContent } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

export const applicationsRoutes = new Hono<AppEnv>();

applicationsRoutes.use("*", requireAuth);

applicationsRoutes.get(
  "/",
  describeRoute({
    summary: "Get user applications",
    tags: ["Applications"],
  }),
  requirePermission("application", "read"),
  async (c) => {
    const user = c.get("user");
    const applications = await applicationsService.getUserApplications({ userId: user.id });
    return ok(c, applications);
  }
);

export const jobApplicationsRoutes = new Hono<AppEnv>();

jobApplicationsRoutes.post(
  "/:id/apply",
  requireAuth,
  requireCandidate(),
  requirePermission("application", "create"),
  describeRoute({
    summary: "Submit job application",
    tags: ["Applications", "Jobs"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", ApplyJobSchema),
  async (c) => {
    const user = c.get("user");
    const { id: jobId } = c.req.valid("param");
    const data = c.req.valid("json");
    
    const application = await applicationsService.applyForJob({ jobId, candidateId: user.id, data });
    return created(c, application, "Application submitted successfully");
  }
);

applicationsRoutes.delete(
  "/:id",
  requirePermission("application", "delete"),
  describeRoute({
    summary: "Withdraw job application",
    tags: ["Applications"],
  }),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await applicationsService.withdrawApplication({ applicationId: id, candidateId: user.id });
    return noContent(c);
  }
);
