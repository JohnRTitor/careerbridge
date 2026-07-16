import { Hono } from "hono";
import { describeRoute, resolver } from "hono-openapi";
import { sValidator } from "@hono/standard-validator";
import { requireUser } from "../../utils/auth";
import { UserEnv } from "../../hono/env.types";
import { UpdateUserProfileSchema, UserProfileSchema } from "./user.schema";
import { ok, fail } from "../../utils/response";
import { createSuccessSchema, errorResponses } from "../../hono/openapi.schemas";
import * as userService from "./user.service";

export const userRoutes = new Hono<UserEnv>();

userRoutes.use("*", async (c, next) => {
  const session = await requireUser(c);
  c.set("session", session);
  await next();
});

userRoutes.get(
  "/profile",
  describeRoute({
    tags: ["User"],
    summary: "Get current user profile",
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": { schema: resolver(createSuccessSchema(UserProfileSchema)) }
        }
      },
      ...errorResponses,
    }
  }),
  async (c) => {
    const session = c.get("session");
    const user = await userService.getUserById(session.user.id);
    
    if (!user) {
      return c.json(fail("User not found"), 404);
    }
    
    return c.json(ok(user));
  }
);

userRoutes.put(
  "/profile",
  describeRoute({
    tags: ["User"],
    summary: "Update current user profile",
    responses: {
      200: {
        description: "Profile updated successfully",
        content: {
          "application/json": { schema: resolver(createSuccessSchema(UserProfileSchema)) }
        }
      },
      ...errorResponses,
    }
  }),
  sValidator("json", UpdateUserProfileSchema),
  async (c) => {
    const session = c.get("session");
    const data = c.req.valid("json");
    
    const user = await userService.updateUser(session.user.id, data);
    
    if (!user) {
      return c.json(fail("User not found"), 404);
    }
    
    return c.json(ok(user));
  }
);
