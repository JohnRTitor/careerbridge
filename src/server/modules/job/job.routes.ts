import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { sValidator } from "@hono/standard-validator";
import { requireUser } from "../../utils/auth";
import { UserEnv } from "../../hono/env.types";
import { CreateJobSchema, JobSchema } from "./job.schema";
import { ok, fail } from "../../utils/response";
import { createSuccessSchema, errorResponses } from "../../hono/openapi.schemas";
import * as jobService from "./job.service";
import { z } from "zod";

export const jobRoutes = new Hono<UserEnv>();

jobRoutes.get(
  "/",
  describeRoute({
    tags: ["Job"],
    summary: "List all jobs",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(createSuccessSchema(z.array(JobSchema))) }
        }
      },
      ...errorResponses,
    }
  }),
  async (c) => {
    const jobs = await jobService.getJobs();
    return c.json(ok(jobs));
  }
);

jobRoutes.get(
  "/:id",
  describeRoute({
    tags: ["Job"],
    summary: "Get a job by ID",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(createSuccessSchema(JobSchema)) }
        }
      },
      ...errorResponses,
    }
  }),
  async (c) => {
    const id = c.req.param("id");
    const job = await jobService.getJobById(id);
    
    if (!job) {
      return c.json(fail("Job not found"), 404);
    }
    
    return c.json(ok(job));
  }
);

// Protected routes below
jobRoutes.use("*", async (c, next) => {
  const session = await requireUser(c);
  c.set("session", session);
  await next();
});

jobRoutes.post(
  "/",
  describeRoute({
    tags: ["Job"],
    summary: "Create a new job posting",
    responses: {
      201: {
        description: "Job created successfully",
        content: {
          "application/json": { schema: resolver(createSuccessSchema(JobSchema)) }
        }
      },
      ...errorResponses,
    }
  }),
  sValidator("json", CreateJobSchema),
  async (c) => {
    const session = c.get("session");
    
    // Only recruiters or admins should be able to create jobs
    if (session.user.role !== "recruiter" && session.user.role !== "admin") {
      return c.json(fail("Only recruiters can create jobs"), 403);
    }

    const { title, description } = c.req.valid("json");
    const job = await jobService.createJob(title, description, session.user.id);
    
    return c.json(ok(job), 201);
  }
);
