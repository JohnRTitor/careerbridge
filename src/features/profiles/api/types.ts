import { rpcClient } from "@/lib/api/rpc";
import { InferResponseType } from "hono/client";
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

type ProfileRoute = typeof rpcClient.api.users.profile.$get;
type Res = InferResponseType<ProfileRoute, 200>;

export type Profile = NonNullable<Res extends { data: infer D } ? D : never>;

type ArrayElement<ArrayType extends readonly unknown[] | undefined> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Education = ArrayElement<Profile["education"]>;
export type Experience = ArrayElement<Profile["experience"]>;
export type Certification = ArrayElement<Profile["certifications"]>;
export type Project = ArrayElement<Profile["projects"]>;
export type Resume = ArrayElement<Profile["resumes"]>;
export type Skill = ArrayElement<Profile["skills"]>;
export type Language = ArrayElement<Profile["languages"]>;
export type SocialLink = ArrayElement<Profile["social_links"]>;

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
