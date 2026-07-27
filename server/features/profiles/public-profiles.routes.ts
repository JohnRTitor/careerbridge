import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { optionalAuth } from "../../app/middleware/auth";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { profilesService } from "./profiles.service";
import { ok } from "../../shared/responses";
import { z } from "zod";

const app = new Hono<AppEnv>();

export const publicProfilesRoutes = app.get(
  "/:userId",
  describeRoute({
    summary: "Get public profile by user ID",
    tags: ["Profiles"],
  }),
  sValidator("param", z.object({ userId: z.string() })),
  optionalAuth,
  async (c) => {
    const { userId } = c.req.valid("param");
    const requester = c.get("user");
    const profile = await profilesService.getPublicProfile({ userId, requester });
    return ok(c, profile);
  }
);
