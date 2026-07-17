import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
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
  async (c) => {
    const { userId } = c.req.valid("param");
    const profile = await profilesService.getPublicProfile({ userId });
    return ok(c, profile);
  }
);
