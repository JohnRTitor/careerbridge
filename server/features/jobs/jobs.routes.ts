import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requirePermission } from "../../app/middleware/authorize";
import { jobsService } from "./jobs.service";
import { JobSearchQuerySchema } from "./jobs.schemas";
import { ok, noContent } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

const app = new Hono<AppEnv>();

export const jobsRoutes = app
  .get(
    "/",
    describeRoute({
      summary: "Search jobs",
      tags: ["Jobs"],
    }),
    sValidator("query", JobSearchQuerySchema),
    async (c) => {
      const input = c.req.valid("query");
      const result = await jobsService.searchJobs(input);
      return ok(c, result);
    }
  )
  .get(
    "/recommendations",
    requireAuth,
    requirePermission("job", "read"),
    describeRoute({
      summary: "Get personalized job recommendations",
      tags: ["Jobs"],
    }),
    async (c) => {
      const user = c.get("user");
      const recommendations = await jobsService.getRecommendations({ userId: user.id });
      return ok(c, recommendations);
    }
  )
  .get(
    "/saved",
    requireAuth,
    requirePermission("bookmark", "read"),
    describeRoute({
      summary: "Get saved jobs",
      tags: ["Jobs"],
    }),
    async (c) => {
      const user = c.get("user");
      const savedJobs = await jobsService.getSavedJobs({ userId: user.id });
      return ok(c, savedJobs);
    }
  )
  .get(
    "/:id",
    describeRoute({
      summary: "Get job details",
      tags: ["Jobs"],
    }),
    sValidator("param", UuidParamSchema),
    async (c) => {
      const { id: jobId } = c.req.valid("param");
      const job = await jobsService.getJobById({ jobId });
      return ok(c, job);
    }
  )
  .post(
    "/:id/save",
    requireAuth,
    requirePermission("bookmark", "create"),
    describeRoute({
      summary: "Save a job",
      tags: ["Jobs"],
    }),
    sValidator("param", UuidParamSchema),
    async (c) => {
      const user = c.get("user");
      const { id: jobId } = c.req.valid("param");
      const result = await jobsService.saveJob({ userId: user.id, jobId });
      return ok(c, result, "Job saved successfully");
    }
  )
  .delete(
    "/:id/save",
    requireAuth,
    requirePermission("bookmark", "delete"),
    describeRoute({
      summary: "Remove saved job",
      tags: ["Jobs"],
    }),
    sValidator("param", UuidParamSchema),
    async (c) => {
      const user = c.get("user");
      const { id: jobId } = c.req.valid("param");
      await jobsService.unsaveJob({ userId: user.id, jobId });
      return noContent(c);
    }
  );
