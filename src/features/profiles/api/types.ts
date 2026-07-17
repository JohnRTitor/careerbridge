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
export type Education = AddEducationPayload & { id: string; created_at?: string; updated_at?: string };
export type Experience = AddExperiencePayload & { id: string; created_at?: string; updated_at?: string };
export type Certification = AddCertificationPayload & { id: string; created_at?: string; updated_at?: string };
export type Project = AddProjectPayload & { id: string; created_at?: string; updated_at?: string };
export type Resume = AddResumePayload & { id: string; uploaded_at?: string; updated_at?: string };

export type Skill = AddUserSkillPayload & { skill_name: string; created_at?: string; updated_at?: string };
export type Language = AddUserLanguagePayload & { language_name: string; created_at?: string; updated_at?: string };
export type SocialLink = AddSocialLinkPayload & { id: string; created_at?: string; updated_at?: string };

export type Profile = UpdateProfilePayload & {
  user_id: string;
  name?: string;
  email?: string;
  image?: string;
  resume_url?: string | null;
  created_at?: string;
  updated_at?: string;
  education: Education[];
  experience: Experience[];
  certifications: Certification[];
  projects: Project[];
  resumes: Resume[];
  skills: Skill[];
  languages: Language[];
  social_links: SocialLink[];
};

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
