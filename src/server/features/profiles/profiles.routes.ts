import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requirePermission } from "../../app/middleware/authorize";
import { ProfilesService } from "./profiles.service";
import { UpdateProfileSchema, ResumeUploadSchema, EducationSchema, ExperienceSchema } from "./profiles.schemas";
import { ok, noContent, created } from "../../shared/responses";
import { UuidParamSchema } from "../../shared/schemas";

export const profilesRoutes = new Hono<AppEnv>();

// All profile routes require authentication
profilesRoutes.use("*", requireAuth);

profilesRoutes.get(
  "/profile",
  describeRoute({
    summary: "Get current user profile",
    tags: ["Profiles"],
  }),
  requirePermission("profile", "read"),
  async (c) => {
    const user = c.get("user");
    const profile = await ProfilesService.getProfile(user.id);
    return ok(c, profile);
  }
);

profilesRoutes.put(
  "/profile",
  describeRoute({
    summary: "Update current user profile",
    tags: ["Profiles"],
  }),
  sValidator("json", UpdateProfileSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const profile = await ProfilesService.updateProfile(user.id, data);
    return ok(c, profile, "Profile updated successfully");
  }
);

profilesRoutes.post(
  "/profile/resume",
  describeRoute({
    summary: "Upload resume URL",
    tags: ["Profiles"],
  }),
  sValidator("json", ResumeUploadSchema),
  requirePermission("resume", "create"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const profile = await ProfilesService.updateResume(user.id, data);
    return ok(c, profile, "Resume updated successfully");
  }
);

profilesRoutes.post(
  "/profile/education",
  describeRoute({
    summary: "Add education entry",
    tags: ["Profiles"],
  }),
  sValidator("json", EducationSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const education = await ProfilesService.addEducation(user.id, data);
    return created(c, education, "Education added successfully");
  }
);

profilesRoutes.put(
  "/profile/education/:id",
  describeRoute({
    summary: "Update education entry",
    tags: ["Profiles"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", EducationSchema.partial()),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const education = await ProfilesService.updateEducation(id, user.id, data);
    return ok(c, education, "Education updated successfully");
  }
);

profilesRoutes.delete(
  "/profile/education/:id",
  describeRoute({
    summary: "Delete education entry",
    tags: ["Profiles"],
  }),
  sValidator("param", UuidParamSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await ProfilesService.deleteEducation(id, user.id);
    return noContent(c);
  }
);

profilesRoutes.post(
  "/profile/experience",
  describeRoute({
    summary: "Add experience entry",
    tags: ["Profiles"],
  }),
  sValidator("json", ExperienceSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const experience = await ProfilesService.addExperience(user.id, data);
    return created(c, experience, "Experience added successfully");
  }
);

profilesRoutes.put(
  "/profile/experience/:id",
  describeRoute({
    summary: "Update experience entry",
    tags: ["Profiles"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", ExperienceSchema.partial()),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const experience = await ProfilesService.updateExperience(id, user.id, data);
    return ok(c, experience, "Experience updated successfully");
  }
);

profilesRoutes.delete(
  "/profile/experience/:id",
  describeRoute({
    summary: "Delete experience entry",
    tags: ["Profiles"],
  }),
  sValidator("param", UuidParamSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await ProfilesService.deleteExperience(id, user.id);
    return noContent(c);
  }
);
