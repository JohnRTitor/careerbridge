import { z } from "zod";
import { 
  UpdateProfileSchema, 
  ResumeUploadSchema, 
  EducationSchema, 
  UpdateEducationSchema,
  ExperienceSchema,
  UpdateExperienceSchema,
  CertificationSchema,
  UpdateCertificationSchema,
  ProjectSchema,
  UpdateProjectSchema,
  ResumeSchema,
  UpdateResumeEntitySchema,
  UserSkillSchema,
  UpdateUserSkillSchema,
  UserLanguageSchema,
  UpdateUserLanguageSchema,
  SocialLinkSchema,
  UpdateSocialLinkSchema,
  JobPreferenceSchema
} from "@server/features/profiles/profiles.schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";

type GetProfileRes = InferResponseType<typeof rpcClient.api.users.profile.$get, 200>;
export type Profile = GetProfileRes extends { data: infer P } ? P : never;

// Infer inner array types
export type Education = Profile extends { education: (infer E)[] } ? E : never;
export type Experience = Profile extends { experience: (infer E)[] } ? E : never;
export type Certification = Profile extends { certifications: (infer C)[] } ? C : never;
export type Project = Profile extends { projects: (infer P)[] } ? P : never;
export type Skill = Profile extends { skills: (infer S)[] } ? S : never;
export type Language = Profile extends { languages: (infer L)[] } ? L : never;
export type SocialLink = Profile extends { social_links: (infer S)[] } ? S : never;

export type UpdateProfilePayload = z.infer<typeof UpdateProfileSchema>;
export type ResumeUploadPayload = z.infer<typeof ResumeUploadSchema>;

export type AddEducationPayload = z.infer<typeof EducationSchema>;
export type UpdateEducationPayload = z.infer<typeof UpdateEducationSchema>;

export type AddExperiencePayload = z.infer<typeof ExperienceSchema>;
export type UpdateExperiencePayload = z.infer<typeof UpdateExperienceSchema>;

export type AddCertificationPayload = z.infer<typeof CertificationSchema>;
export type UpdateCertificationPayload = z.infer<typeof UpdateCertificationSchema>;

export type AddProjectPayload = z.infer<typeof ProjectSchema>;
export type UpdateProjectPayload = z.infer<typeof UpdateProjectSchema>;

export type AddResumePayload = z.infer<typeof ResumeSchema>;
export type UpdateResumeEntityPayload = z.infer<typeof UpdateResumeEntitySchema>;

export type AddUserSkillPayload = z.infer<typeof UserSkillSchema>;
export type UpdateUserSkillPayload = z.infer<typeof UpdateUserSkillSchema>;

export type AddUserLanguagePayload = z.infer<typeof UserLanguageSchema>;
export type UpdateUserLanguagePayload = z.infer<typeof UpdateUserLanguageSchema>;

export type AddSocialLinkPayload = z.infer<typeof SocialLinkSchema>;
export type UpdateSocialLinkPayload = z.infer<typeof UpdateSocialLinkSchema>;

export type JobPreferencePayload = z.infer<typeof JobPreferenceSchema>;
