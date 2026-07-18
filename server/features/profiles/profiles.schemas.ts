import { z } from "zod";

export const ProfileVisibilitySchema = z.enum(["public", "private"]);

export const UpdateProfileSchema = z
  .object({
    headline: z.string().optional(),
    about: z.string().optional(),
    visibility: ProfileVisibilitySchema.optional(),
    portfolio_url: z.url().optional().or(z.literal("")),
  })
  .meta({ id: "UpdateUserProfile" });

export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

export const ResumeUploadSchema = z
  .object({
    resume_url: z.url(),
  })
  .meta({ id: "ResumeUpload" });

export type ResumeUpload = z.infer<typeof ResumeUploadSchema>;

export const EducationSchema = z
  .object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    field_of_study: z.string().optional(),
    start_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { error: "Invalid date" }),
    end_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { error: "Invalid date" })
      .optional(),
    description: z.string().optional(),
  })
  .meta({ id: "EducationEntry" });
export type Education = z.infer<typeof EducationSchema>;

export const UpdateEducationSchema = EducationSchema.partial().meta({
  id: "UpdateEducation",
});
export type UpdateEducation = z.infer<typeof UpdateEducationSchema>;

export const ExperienceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    start_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { error: "Invalid date" }),
    end_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { error: "Invalid date" })
      .optional(),
    description: z.string().optional(),
  })
  .meta({ id: "ExperienceEntry" });
export type Experience = z.infer<typeof ExperienceSchema>;

export const UpdateExperienceSchema = ExperienceSchema.partial().meta({
  id: "UpdateExperience",
});
export type UpdateExperience = z.infer<typeof UpdateExperienceSchema>;

// Input Types
export type GetProfileInput = {
  userId: string;
};

export type UpdateProfileInput = {
  userId: string;
  data: z.infer<typeof UpdateProfileSchema>;
};

export type UpdateResumeInput = {
  userId: string;
  data: z.infer<typeof ResumeUploadSchema>;
};

export type AddEducationInput = {
  userId: string;
  data: z.infer<typeof EducationSchema>;
};

export type UpdateEducationInput = {
  educationId: string;
  userId: string;
  data: z.infer<typeof UpdateEducationSchema>;
};

export type DeleteEducationInput = {
  educationId: string;
  userId: string;
};

export type AddExperienceInput = {
  userId: string;
  data: z.infer<typeof ExperienceSchema>;
};

export type UpdateExperienceInput = {
  experienceId: string;
  userId: string;
  data: z.infer<typeof UpdateExperienceSchema>;
};

export type DeleteExperienceInput = {
  experienceId: string;
  userId: string;
};

// -- Certifications --
export const CertificationSchema = z.object({
  name: z.string().min(1),
  issuer: z.string().optional(),
  issue_date: z.string().optional(),
  expiry_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.url().optional().or(z.literal("")),
});
export type Certification = z.infer<typeof CertificationSchema>;

export const UpdateCertificationSchema = CertificationSchema.partial();
export type UpdateCertification = z.infer<typeof UpdateCertificationSchema>;

export type AddCertificationInput = {
  userId: string;
  data: z.infer<typeof CertificationSchema>;
};
export type UpdateCertificationInput = {
  certificationId: string;
  userId: string;
  data: z.infer<typeof UpdateCertificationSchema>;
};
export type DeleteCertificationInput = {
  certificationId: string;
  userId: string;
};

// -- Projects --
export const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  repository_url: z.url().optional().or(z.literal("")),
  live_url: z.url().optional().or(z.literal("")),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const UpdateProjectSchema = ProjectSchema.partial();
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;

export type AddProjectInput = {
  userId: string;
  data: z.infer<typeof ProjectSchema>;
};
export type UpdateProjectInput = {
  projectId: string;
  userId: string;
  data: z.infer<typeof UpdateProjectSchema>;
};
export type DeleteProjectInput = { projectId: string; userId: string };

// -- Resumes --
export const ResumeSchema = z.object({
  title: z.string().optional(),
  file_url: z.url(),
  is_default: z.boolean().optional().default(false),
});
export type Resume = z.infer<typeof ResumeSchema>;

export const UpdateResumeEntitySchema = z.object({
  title: z.string().optional(),
  is_default: z.boolean().optional(),
});
export type UpdateResumeEntity = z.infer<typeof UpdateResumeEntitySchema>;

export type AddResumeInput = {
  userId: string;
  data: z.infer<typeof ResumeSchema>;
};
export type UpdateResumeEntityInput = {
  resumeId: string;
  userId: string;
  data: z.infer<typeof UpdateResumeEntitySchema>;
};
export type DeleteResumeInput = { resumeId: string; userId: string };

// -- Skills --
export const UserSkillSchema = z.object({
  skill_id: z.uuid(),
  years_of_experience: z.number().int().nonnegative().optional(),
  proficiency: z.number().int().min(1).max(5).optional(),
});
export type UserSkill = z.infer<typeof UserSkillSchema>;

export const UpdateUserSkillSchema = UserSkillSchema.omit({ skill_id: true });
export type UpdateUserSkill = z.infer<typeof UpdateUserSkillSchema>;

export type AddUserSkillInput = {
  userId: string;
  data: z.infer<typeof UserSkillSchema>;
};
export type UpdateUserSkillInput = {
  skillId: string;
  userId: string;
  data: z.infer<typeof UpdateUserSkillSchema>;
};
export type DeleteUserSkillInput = { skillId: string; userId: string };

// -- Languages --
export const UserLanguageSchema = z.object({
  language_id: z.uuid(),
  proficiency: z.string().optional(),
});
export type UserLanguage = z.infer<typeof UserLanguageSchema>;

export const UpdateUserLanguageSchema = UserLanguageSchema.omit({
  language_id: true,
});
export type UpdateUserLanguage = z.infer<typeof UpdateUserLanguageSchema>;

export type AddUserLanguageInput = {
  userId: string;
  data: z.infer<typeof UserLanguageSchema>;
};
export type UpdateUserLanguageInput = {
  languageId: string;
  userId: string;
  data: z.infer<typeof UpdateUserLanguageSchema>;
};
export type DeleteUserLanguageInput = { languageId: string; userId: string };

// -- Social Links --
export const SocialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.url(),
});
export type SocialLink = z.infer<typeof SocialLinkSchema>;

export const UpdateSocialLinkSchema = SocialLinkSchema.partial();
export type UpdateSocialLink = z.infer<typeof UpdateSocialLinkSchema>;

export type AddSocialLinkInput = {
  userId: string;
  data: z.infer<typeof SocialLinkSchema>;
};
export type UpdateSocialLinkInput = {
  linkId: string;
  userId: string;
  data: z.infer<typeof UpdateSocialLinkSchema>;
};
export type DeleteSocialLinkInput = { linkId: string; userId: string };

// -- Job Preferences --
export const JobPreferenceSchema = z.object({
  preferred_job_type: z
    .enum(["full-time", "part-time", "contract", "internship", "freelance"])
    .optional(),
  preferred_work_mode: z.enum(["remote", "hybrid", "onsite"]).optional(),
  preferred_location: z.string().optional(),
  expected_salary: z.number().optional(),
  notice_period: z.number().optional(),
  willing_to_relocate: z.boolean().optional(),
});
export type JobPreference = z.infer<typeof JobPreferenceSchema>;

export const UpdateJobPreferenceSchema = JobPreferenceSchema;

export type UpsertJobPreferenceInput = {
  userId: string;
  data: z.infer<typeof JobPreferenceSchema>;
};
