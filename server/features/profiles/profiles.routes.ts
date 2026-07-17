import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { requirePermission } from "../../app/middleware/authorize";
import { profilesService } from "./profiles.service";
import { profilesRepository } from "./profiles.repository";
import { CertificationSchema, UpdateCertificationSchema, ProjectSchema, UpdateProjectSchema, ResumeSchema, UpdateResumeEntitySchema, UserSkillSchema, UpdateUserSkillSchema, UserLanguageSchema, UpdateUserLanguageSchema, SocialLinkSchema, UpdateSocialLinkSchema, JobPreferenceSchema } from "./profiles.schemas";
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

const app = new Hono<AppEnv>();

export const profilesRoutes = app

// All profile routes require authentication
  .use("*", requireAuth)

  .get(
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
)

  .patch(
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
)

  .post(
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
)

  .post(
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
)

  .patch(
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
)

  .delete(
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
)

  .post(
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
)

  .patch(
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
)

  .delete(
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
)

  .post(
  "/profile/certifications",
  describeRoute({ summary: "Add certification", tags: ["Profiles"] }),
  sValidator("json", CertificationSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const cert = await profilesService.addCertification({ userId: user.id, data });
    return created(c, cert, "Certification added successfully");
  }
)
  .patch(
  "/profile/certifications/:id",
  describeRoute({ summary: "Update certification", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateCertificationSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const cert = await profilesService.updateCertification({ certificationId: id, userId: user.id, data });
    return ok(c, cert, "Certification updated successfully");
  }
)
  .delete(
  "/profile/certifications/:id",
  describeRoute({ summary: "Delete certification", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await profilesService.deleteCertification({ certificationId: id, userId: user.id });
    return noContent(c);
  }
)

// -- Projects --
  .post(
  "/profile/projects",
  describeRoute({ summary: "Add project", tags: ["Profiles"] }),
  sValidator("json", ProjectSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const project = await profilesService.addProject({ userId: user.id, data });
    return created(c, project, "Project added successfully");
  }
)
  .patch(
  "/profile/projects/:id",
  describeRoute({ summary: "Update project", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateProjectSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const project = await profilesService.updateProject({ projectId: id, userId: user.id, data });
    return ok(c, project, "Project updated successfully");
  }
)
  .delete(
  "/profile/projects/:id",
  describeRoute({ summary: "Delete project", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await profilesService.deleteProject({ projectId: id, userId: user.id });
    return noContent(c);
  }
)

// -- Resumes (Table CRUD) --
  .get(
  "/profile/resumes",
  describeRoute({ summary: "Get resumes", tags: ["Profiles"] }),
  requirePermission("resume", "read"),
  async (c) => {
    const user = c.get("user");
    const resumes = await profilesRepository.getResumes({ userId: user.id });
    return ok(c, resumes);
  }
)
  .post(
  "/profile/resumes",
  describeRoute({ summary: "Add resume", tags: ["Profiles"] }),
  sValidator("json", ResumeSchema),
  requirePermission("resume", "create"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const resume = await profilesService.addResume({ userId: user.id, data });
    return created(c, resume, "Resume added successfully");
  }
)
  .patch(
  "/profile/resumes/:id",
  describeRoute({ summary: "Update resume", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateResumeEntitySchema),
  requirePermission("resume", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const resume = await profilesService.updateResumeEntity({ resumeId: id, userId: user.id, data });
    return ok(c, resume, "Resume updated successfully");
  }
)
  .delete(
  "/profile/resumes/:id",
  describeRoute({ summary: "Delete resume", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  requirePermission("resume", "delete"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await profilesService.deleteResume({ resumeId: id, userId: user.id });
    return noContent(c);
  }
)

// -- User Skills --
  .post(
  "/profile/skills",
  describeRoute({ summary: "Add user skill", tags: ["Profiles"] }),
  sValidator("json", UserSkillSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const skill = await profilesService.addUserSkill({ userId: user.id, data });
    return created(c, skill, "Skill added successfully");
  }
)
  .patch(
  "/profile/skills/:id",
  describeRoute({ summary: "Update user skill", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateUserSkillSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const skill = await profilesService.updateUserSkill({ skillId: id, userId: user.id, data });
    return ok(c, skill, "Skill updated successfully");
  }
)
  .delete(
  "/profile/skills/:id",
  describeRoute({ summary: "Delete user skill", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await profilesService.deleteUserSkill({ skillId: id, userId: user.id });
    return noContent(c);
  }
)

// -- User Languages --
  .post(
  "/profile/languages",
  describeRoute({ summary: "Add user language", tags: ["Profiles"] }),
  sValidator("json", UserLanguageSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const lang = await profilesService.addUserLanguage({ userId: user.id, data });
    return created(c, lang, "Language added successfully");
  }
)
  .patch(
  "/profile/languages/:id",
  describeRoute({ summary: "Update user language", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateUserLanguageSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const lang = await profilesService.updateUserLanguage({ languageId: id, userId: user.id, data });
    return ok(c, lang, "Language updated successfully");
  }
)
  .delete(
  "/profile/languages/:id",
  describeRoute({ summary: "Delete user language", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await profilesService.deleteUserLanguage({ languageId: id, userId: user.id });
    return noContent(c);
  }
)

// -- Social Links --
  .post(
  "/profile/social-links",
  describeRoute({ summary: "Add social link", tags: ["Profiles"] }),
  sValidator("json", SocialLinkSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const link = await profilesService.addSocialLink({ userId: user.id, data });
    return created(c, link, "Social link added successfully");
  }
)
  .patch(
  "/profile/social-links/:id",
  describeRoute({ summary: "Update social link", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  sValidator("json", UpdateSocialLinkSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    const data = c.req.valid("json");
    const link = await profilesService.updateSocialLink({ linkId: id, userId: user.id, data });
    return ok(c, link, "Social link updated successfully");
  }
)
  .delete(
  "/profile/social-links/:id",
  describeRoute({ summary: "Delete social link", tags: ["Profiles"] }),
  sValidator("param", UuidParamSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const { id } = c.req.valid("param");
    await profilesService.deleteSocialLink({ linkId: id, userId: user.id });
    return noContent(c);
  }
)

// -- Job Preferences --
  .get(
  "/profile/preferences",
  describeRoute({ summary: "Get job preferences", tags: ["Profiles"] }),
  requirePermission("profile", "read"),
  async (c) => {
    const user = c.get("user");
    const prefs = await profilesRepository.getJobPreferences({ userId: user.id });
    return ok(c, prefs);
  }
)
  .put(
  "/profile/preferences",
  describeRoute({ summary: "Upsert job preferences", tags: ["Profiles"] }),
  sValidator("json", JobPreferenceSchema),
  requirePermission("profile", "update"),
  async (c) => {
    const user = c.get("user");
    const data = c.req.valid("json");
    const prefs = await profilesService.upsertJobPreferences({ userId: user.id, data });
    return ok(c, prefs, "Job preferences updated successfully");
  }
);
