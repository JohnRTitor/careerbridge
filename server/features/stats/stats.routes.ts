import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { describeRoute } from "hono-openapi";
import { statsService } from "./stats.service";
import { ok } from "../../shared/responses";

const app = new Hono<AppEnv>();

export const statsRoutes = app
  .get(
    "/",
    describeRoute({
      summary: "Get homepage stats",
      tags: ["Stats"],
    }),
    async (c) => {
      const stats = await statsService.getHomepageStats();
      return ok(c, stats);
    }
  )
  .get(
    "/categories",
    describeRoute({
      summary: "Get job categories by industry",
      tags: ["Stats"],
    }),
    async (c) => {
      const categories = await statsService.getJobCategories();
      return ok(c, categories);
    }
  );
