import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { authGuard } from "../../app/middleware/auth.guard";
import { JobsService } from "./jobs.service";
import { JobSearchQuerySchema } from "./jobs.schemas";
import { ok, noContent } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

export const jobsRoutes = new Hono<AppEnv>();

jobsRoutes.get(
  "/",
  describeRoute({
    summary: "Search jobs",
    tags: ["Jobs"],
  }),
  sValidator("query", JobSearchQuerySchema),
  async (c) => {
    const query = c.req.valid("query");
    const result = await JobsService.searchJobs(query);
    return ok(c, result);
  }
);

jobsRoutes.get(
  "/recommendations",
  authGuard,
  describeRoute({
    summary: "Get personalized job recommendations",
    tags: ["Jobs"],
  }),
  async (c) => {
    const user = c.get("user");
    const recommendations = await JobsService.getRecommendations(user.id);
    return ok(c, recommendations);
  }
);

jobsRoutes.get(
  "/:id",
  describeRoute({
    summary: "Get job details",
    tags: ["Jobs"],
  }),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const job = await JobsService.getJobById(id);
    return ok(c, job);
  }
);

jobsRoutes.post(
  "/:id/save",
  authGuard,
  describeRoute({
    summary: "Save a job",
    tags: ["Jobs"],
  }),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const result = await JobsService.saveJob(user.id, id);
    return ok(c, result, "Job saved successfully");
  }
);

jobsRoutes.delete(
  "/:id/save",
  authGuard,
  describeRoute({
    summary: "Remove saved job",
    tags: ["Jobs"],
  }),
  sValidator("param", UuidParamSchema),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await JobsService.unsaveJob(user.id, id);
    return noContent(c);
  }
);
