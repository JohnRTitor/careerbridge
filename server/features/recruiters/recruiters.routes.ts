import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requirePermission } from "../../app/middleware/authorize";
import { requireOwnership } from "../../app/middleware/ownership";
import { pool } from "../../app/db";
import { recruitersService } from "./recruiters.service";
import { CreateJobSchema, UpdateJobSchema, UpdateApplicationStatusSchema, RecruiterProfileSchema, GetRecruiterJobsSchema, GetRecruiterApplicationsSchema } from "./recruiters.schemas";
import { ok, created, noContent } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

const app = new Hono<AppEnv>();
app.use("*", requireAuth);

export const recruitersRoutes = app
  .post(
    "/jobs",
    describeRoute({
      summary: "Create a new job posting",
      tags: ["Recruiters"],
    }),
    sValidator("json", CreateJobSchema),
    requirePermission("job", "create"),
    async (c) => {
      const user = c.get("user");
      const data = c.req.valid("json");
      const job = await recruitersService.createJob({ recruiterId: user.id, data });
      return created(c, job, "Job created successfully");
    }
  )
  .patch(
    "/jobs/:id",
    describeRoute({
      summary: "Update an existing job posting",
      tags: ["Recruiters"],
    }),
    sValidator("param", UuidParamSchema),
    sValidator("json", UpdateJobSchema),
    requirePermission("job", "update"),
    requireOwnership(
      (c) => pool.query<{ created_by: string }>("SELECT created_by FROM jobs WHERE id = $1", [c.req.param("id")]).then((r) => r.rows[0]),
      (user, job) => job?.created_by === user.id
    ),
    async (c) => {
      const user = c.get("user");
      const { id: jobId } = c.req.valid("param");
      const data = c.req.valid("json");
      const job = await recruitersService.updateJob({ jobId, recruiterId: user.id, data });
      return ok(c, job, "Job updated successfully");
    }
  )
  .delete(
    "/jobs/:id",
    describeRoute({
      summary: "Delete a job posting",
      tags: ["Recruiters"],
    }),
    sValidator("param", UuidParamSchema),
    requirePermission("job", "delete"),
    requireOwnership(
      (c) => pool.query<{ created_by: string }>("SELECT created_by FROM jobs WHERE id = $1", [c.req.param("id")]).then((r) => r.rows[0]),
      (user, job) => job?.created_by === user.id
    ),
    async (c) => {
      const user = c.get("user");
      const { id: jobId } = c.req.valid("param");
      await recruitersService.deleteJob({ jobId, recruiterId: user.id });
      return noContent(c);
    }
  )
  .get(
    "/jobs/:id/applicants",
    describeRoute({
      summary: "Get applicants for a job",
      tags: ["Recruiters"],
    }),
    sValidator("param", UuidParamSchema),
    requirePermission("application", "read"),
    async (c) => {
      const user = c.get("user");
      const { id: jobId } = c.req.valid("param");
      const applicants = await recruitersService.getJobApplicants({ jobId, recruiterId: user.id });
      return ok(c, applicants);
    }
  )
  .patch(
    "/applications/:id/status",
    describeRoute({
      summary: "Update applicant status",
      tags: ["Recruiters"],
    }),
    sValidator("param", UuidParamSchema),
    sValidator("json", UpdateApplicationStatusSchema),
    requirePermission("application", "review"),
    requireOwnership(
      (c) => pool.query<{ created_by: string }>(
        `SELECT jobs.created_by FROM applications 
         JOIN jobs ON applications.job_id = jobs.id 
         WHERE applications.id = $1`, 
        [c.req.param("id")]
      ).then((r) => r.rows[0]),
      (user, data) => data?.created_by === user.id
    ),
    async (c) => {
      const user = c.get("user");
      const { id: applicationId } = c.req.valid("param");
      const data = c.req.valid("json");
      const application = await recruitersService.updateApplicationStatus({ applicationId, recruiterId: user.id, data });
      return ok(c, application, "Status updated successfully");
    }
  )
  .get(
    "/analytics",
    describeRoute({
      summary: "Get recruitment analytics dashboard data",
      tags: ["Recruiters"],
    }),
    requirePermission("analytics", "read"),
    async (c) => {
      const user = c.get("user");
      const analytics = await recruitersService.getAnalytics({ recruiterId: user.id });
      return ok(c, analytics);
    }
  )
  .get(
    "/profile",
    describeRoute({ summary: "Get recruiter profile", tags: ["Recruiters"] }),
    async (c) => {
      const user = c.get("user");
      const profile = await recruitersService.getRecruiterProfile({ userId: user.id });
      return ok(c, profile);
    }
  )
  .put(
    "/profile",
    describeRoute({ summary: "Upsert recruiter profile", tags: ["Recruiters"] }),
    sValidator("json", RecruiterProfileSchema),
    async (c) => {
      const user = c.get("user");
      const data = c.req.valid("json");
      const profile = await recruitersService.upsertRecruiterProfile({ userId: user.id, data });
      return ok(c, profile, "Profile updated successfully");
    }
  )
  .get(
    "/jobs",
    describeRoute({ summary: "Get recruiter jobs", tags: ["Recruiters"] }),
    sValidator("query", GetRecruiterJobsSchema),
    requirePermission("job", "read"),
    async (c) => {
      const user = c.get("user");
      const input = c.req.valid("query");
      const jobs = await recruitersService.getRecruiterJobs({ ...input, recruiterId: user.id });
      return ok(c, jobs);
    }
  )
  .get(
    "/applications",
    describeRoute({ summary: "Get recruiter applications", tags: ["Recruiters"] }),
    sValidator("query", GetRecruiterApplicationsSchema),
    requirePermission("application", "read"),
    async (c) => {
      const user = c.get("user");
      const input = c.req.valid("query");
      const applications = await recruitersService.getRecruiterApplications({ ...input, recruiterId: user.id });
      return ok(c, applications);
    }
  );
