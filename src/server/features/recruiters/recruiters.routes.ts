import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { authGuard, roleGuard } from "../../app/middleware/auth.guard";
import { RecruitersService } from "./recruiters.service";
import { CreateJobSchema, UpdateApplicationStatusSchema } from "./recruiters.schemas";
import { ok, created, noContent } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

export const recruitersRoutes = new Hono<AppEnv>();

// All recruiter routes require auth and 'recruiter' or 'admin' role
recruitersRoutes.use("*", authGuard);
recruitersRoutes.use("*", roleGuard(["recruiter", "admin"]));

recruitersRoutes.post(
  "/jobs",
  describeRoute({
    summary: "Create a new job posting",
    tags: ["Recruiters"],
  }),
  sValidator("json", CreateJobSchema),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const job = await RecruitersService.createJob(user.id, data);
    return created(c, job, "Job created successfully");
  }
);

recruitersRoutes.put(
  "/jobs/:id",
  describeRoute({
    summary: "Update an existing job posting",
    tags: ["Recruiters"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", CreateJobSchema.partial()),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const job = await RecruitersService.updateJob(id, user.id, data);
    return ok(c, job, "Job updated successfully");
  }
);

recruitersRoutes.delete(
  "/jobs/:id",
  describeRoute({
    summary: "Delete a job posting",
    tags: ["Recruiters"],
  }),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await RecruitersService.deleteJob(id, user.id);
    return noContent(c);
  }
);

recruitersRoutes.get(
  "/jobs/:id/applicants",
  describeRoute({
    summary: "Get applicants for a job",
    tags: ["Recruiters"],
  }),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const applicants = await RecruitersService.getJobApplicants(id, user.id);
    return ok(c, applicants);
  }
);

recruitersRoutes.put(
  "/applications/:id/status",
  describeRoute({
    summary: "Update applicant status",
    tags: ["Recruiters"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateApplicationStatusSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const application = await RecruitersService.updateApplicationStatus(id, user.id, data);
    return ok(c, application, "Status updated successfully");
  }
);

recruitersRoutes.get(
  "/analytics",
  describeRoute({
    summary: "Get recruitment analytics dashboard data",
    tags: ["Recruiters"],
  }),
  async (c) => {
    const user = c.get("user");
    const analytics = await RecruitersService.getAnalytics(user.id);
    return ok(c, analytics);
  }
);
