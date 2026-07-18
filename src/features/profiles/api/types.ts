import type { ProfileResponse } from "@server/features/profiles/profiles.service";
import type { 
  UpdateProfile as UpdateProfilePayload, 
  ResumeUpload as ResumeUploadPayload, 
  Education as AddEducationPayload, 
  UpdateEducation as UpdateEducationPayload,
  Experience as AddExperiencePayload,
  UpdateExperience as UpdateExperiencePayload,
  Certification as AddCertificationPayload,
  UpdateCertification as UpdateCertificationPayload,
  Project as AddProjectPayload,
  UpdateProject as UpdateProjectPayload,
  Resume as AddResumePayload,
  UpdateResumeEntity as UpdateResumeEntityPayload,
  UserSkill as AddUserSkillPayload,
  UpdateUserSkill as UpdateUserSkillPayload,
  UserLanguage as AddUserLanguagePayload,
  UpdateUserLanguage as UpdateUserLanguagePayload,
  SocialLink as AddSocialLinkPayload,
  UpdateSocialLink as UpdateSocialLinkPayload,
  JobPreference as JobPreferencePayload
} from "@server/features/profiles/profiles.schemas";

export type Education = AddEducationPayload & { id: string; created_at?: string; updated_at?: string };
export type Experience = AddExperiencePayload & { id: string; created_at?: string; updated_at?: string };
export type Certification = AddCertificationPayload & { id: string; created_at?: string; updated_at?: string };
export type Project = AddProjectPayload & { id: string; created_at?: string; updated_at?: string };
export type Resume = AddResumePayload & { id: string; uploaded_at?: string; updated_at?: string };

export type Skill = AddUserSkillPayload & { skill_name: string; created_at?: string; updated_at?: string };
export type Language = AddUserLanguagePayload & { language_name: string; created_at?: string; updated_at?: string };
export type SocialLink = AddSocialLinkPayload & { id: string; created_at?: string; updated_at?: string };

export type Profile = NonNullable<ProfileResponse>;
export type {
  UpdateProfilePayload,
  ResumeUploadPayload,
  AddEducationPayload,
  UpdateEducationPayload,
  AddExperiencePayload,
  UpdateExperiencePayload,
  AddCertificationPayload,
  UpdateCertificationPayload,
  AddProjectPayload,
  UpdateProjectPayload,
  AddResumePayload,
  UpdateResumeEntityPayload,
  AddUserSkillPayload,
  UpdateUserSkillPayload,
  AddUserLanguagePayload,
  UpdateUserLanguagePayload,
  AddSocialLinkPayload,
  UpdateSocialLinkPayload,
  JobPreferencePayload
};
