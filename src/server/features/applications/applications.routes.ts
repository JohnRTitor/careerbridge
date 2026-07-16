import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { authGuard } from "../../app/middleware/auth.guard";
import { ApplicationsService } from "./applications.service";
import { ApplyJobSchema } from "./applications.schemas";
import { ok, created } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

export const applicationsRoutes = new Hono<AppEnv>();

applicationsRoutes.use("*", authGuard);

applicationsRoutes.get(
  "/",
  describeRoute({
    summary: "Get user applications",
    tags: ["Applications"],
  }),
  async (c) => {
    const user = c.get("user");
    const applications = await ApplicationsService.getUserApplications(user.id);
    return ok(c, applications);
  }
);

export const jobApplicationsRoutes = new Hono<AppEnv>();

jobApplicationsRoutes.post(
  "/:id/apply",
  authGuard,
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
    
    const application = await ApplicationsService.applyForJob(jobId, user.id, data);
    return created(c, application, "Application submitted successfully");
  }
);
