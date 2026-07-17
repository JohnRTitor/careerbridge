import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requirePermission } from "../../app/middleware/authorize";
import { profilesService } from "./profiles.service";
import { 
  UpdateProfileSchema, 
  ResumeUploadSchema, 
  EducationSchema, 
  UpdateEducationSchema,
  ExperienceSchema,
  UpdateExperienceSchema
} from "./profiles.schemas";
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
    const profile = await profilesService.getProfile({ userId: user.id });
    return ok(c, profile);
  }
);

profilesRoutes.patch(
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
    const profile = await profilesService.updateProfile({ userId: user.id, data });
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
    const profile = await profilesService.updateResume({ userId: user.id, data });
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
    const education = await profilesService.addEducation({ userId: user.id, data });
    return created(c, education, "Education added successfully");
  }
);

profilesRoutes.patch(
  "/profile/education/:id",
  describeRoute({
    summary: "Update education entry",
    tags: ["Profiles"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateEducationSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id: educationId } = c.req.valid("param");
    const data = c.req.valid("json");
    const education = await profilesService.updateEducation({ educationId, userId: user.id, data });
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
    const { id: educationId } = c.req.valid("param");
    await profilesService.deleteEducation({ educationId, userId: user.id });
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
    const experience = await profilesService.addExperience({ userId: user.id, data });
    return created(c, experience, "Experience added successfully");
  }
);

profilesRoutes.patch(
  "/profile/experience/:id",
  describeRoute({
    summary: "Update experience entry",
    tags: ["Profiles"],
  }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateExperienceSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id: experienceId } = c.req.valid("param");
    const data = c.req.valid("json");
    const experience = await profilesService.updateExperience({ experienceId, userId: user.id, data });
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
    const { id: experienceId } = c.req.valid("param");
    await profilesService.deleteExperience({ experienceId, userId: user.id });
    return noContent(c);
  }
);
