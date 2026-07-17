import { profilesRepository } from "./profiles.repository";
import { NotFoundError } from "../../shared/errors";
import type { 
  GetProfileInput, 
  UpdateProfileInput, 
  UpdateResumeInput, 
  AddEducationInput, 
  UpdateEducationInput, 
  DeleteEducationInput, 
  AddExperienceInput, 
  UpdateExperienceInput, 
  DeleteExperienceInput,
  AddCertificationInput,
  UpdateCertificationInput,
  DeleteCertificationInput,
  AddProjectInput,
  UpdateProjectInput,
  DeleteProjectInput,
  AddResumeInput,
  UpdateResumeEntityInput,
  DeleteResumeInput,
  AddUserSkillInput,
  UpdateUserSkillInput,
  DeleteUserSkillInput,
  AddUserLanguageInput,
  UpdateUserLanguageInput,
  DeleteUserLanguageInput,
  AddSocialLinkInput,
  UpdateSocialLinkInput,
  DeleteSocialLinkInput,
  UpsertJobPreferenceInput
} from "./profiles.schemas";

export async function getProfile(input: GetProfileInput) {
  const { userId } = input;
  const profile = await profilesRepository.getProfile({ userId });
  if (!profile) {
    return { headline: null, about: null, visibility: "public", resume_url: null, portfolio_url: null };
  }
  const education = await profilesRepository.getEducation({ userId });
  const experience = await profilesRepository.getExperience({ userId });
  const certifications = await profilesRepository.getCertifications({ userId });
  const projects = await profilesRepository.getProjects({ userId });
  const skills = await profilesRepository.getUserSkills({ userId });
  const languages = await profilesRepository.getUserLanguages({ userId });
  const social_links = await profilesRepository.getSocialLinks({ userId });
  const resumes = await profilesRepository.getResumes({ userId });
  
  return { 
    ...profile, 
    education, 
    experience,
    certifications,
    projects,
    skills,
    languages,
    social_links,
    resumes
  };
}

export async function updateProfile(input: UpdateProfileInput) {
  return profilesRepository.upsertProfile(input);
}

export async function updateResume(input: UpdateResumeInput) {
  return profilesRepository.updateResume(input);
}

export async function addEducation(input: AddEducationInput) {
  return profilesRepository.addEducation(input);
}

export async function updateEducation(input: UpdateEducationInput) {
  const result = await profilesRepository.updateEducation(input);
  if (!result) throw new NotFoundError("Education entry not found");
  return result;
}

export async function deleteEducation(input: DeleteEducationInput) {
  const success = await profilesRepository.deleteEducation(input);
  if (!success) throw new NotFoundError("Education entry not found");
}

export async function addExperience(input: AddExperienceInput) {
  return profilesRepository.addExperience(input);
}

export async function updateExperience(input: UpdateExperienceInput) {
  const result = await profilesRepository.updateExperience(input);
  if (!result) throw new NotFoundError("Experience entry not found");
  return result;
}

export async function deleteExperience(input: DeleteExperienceInput) {
  const success = await profilesRepository.deleteExperience(input);
  if (!success) throw new NotFoundError("Experience entry not found");
}

// Certifications
export async function addCertification(input: AddCertificationInput) {
  return profilesRepository.addCertification(input);
}
export async function updateCertification(input: UpdateCertificationInput) {
  const result = await profilesRepository.updateCertification(input);
  if (!result) throw new NotFoundError("Certification entry not found");
  return result;
}
export async function deleteCertification(input: DeleteCertificationInput) {
  const success = await profilesRepository.deleteCertification(input);
  if (!success) throw new NotFoundError("Certification entry not found");
}

// Projects
export async function addProject(input: AddProjectInput) {
  return profilesRepository.addProject(input);
}
export async function updateProject(input: UpdateProjectInput) {
  const result = await profilesRepository.updateProject(input);
  if (!result) throw new NotFoundError("Project entry not found");
  return result;
}
export async function deleteProject(input: DeleteProjectInput) {
  const success = await profilesRepository.deleteProject(input);
  if (!success) throw new NotFoundError("Project entry not found");
}

// Resumes
export async function addResume(input: AddResumeInput) {
  return profilesRepository.addResume(input);
}
export async function updateResumeEntity(input: UpdateResumeEntityInput) {
  const result = await profilesRepository.updateResumeEntity(input);
  if (!result) throw new NotFoundError("Resume entry not found");
  return result;
}
export async function deleteResume(input: DeleteResumeInput) {
  const success = await profilesRepository.deleteResume(input);
  if (!success) throw new NotFoundError("Resume entry not found");
}

// User Skills
export async function addUserSkill(input: AddUserSkillInput) {
  return profilesRepository.addUserSkill(input);
}
export async function updateUserSkill(input: UpdateUserSkillInput) {
  const result = await profilesRepository.updateUserSkill(input);
  if (!result) throw new NotFoundError("Skill entry not found");
  return result;
}
export async function deleteUserSkill(input: DeleteUserSkillInput) {
  const success = await profilesRepository.deleteUserSkill(input);
  if (!success) throw new NotFoundError("Skill entry not found");
}

// User Languages
export async function addUserLanguage(input: AddUserLanguageInput) {
  return profilesRepository.addUserLanguage(input);
}
export async function updateUserLanguage(input: UpdateUserLanguageInput) {
  const result = await profilesRepository.updateUserLanguage(input);
  if (!result) throw new NotFoundError("Language entry not found");
  return result;
}
export async function deleteUserLanguage(input: DeleteUserLanguageInput) {
  const success = await profilesRepository.deleteUserLanguage(input);
  if (!success) throw new NotFoundError("Language entry not found");
}

// Social Links
export async function addSocialLink(input: AddSocialLinkInput) {
  return profilesRepository.addSocialLink(input);
}
export async function updateSocialLink(input: UpdateSocialLinkInput) {
  const result = await profilesRepository.updateSocialLink(input);
  if (!result) throw new NotFoundError("Social link not found");
  return result;
}
export async function deleteSocialLink(input: DeleteSocialLinkInput) {
  const success = await profilesRepository.deleteSocialLink(input);
  if (!success) throw new NotFoundError("Social link not found");
}

// Job Preferences
export async function upsertJobPreferences(input: UpsertJobPreferenceInput) {
  return profilesRepository.upsertJobPreferences(input);
}

export const profilesService = {
  getProfile,
  updateProfile,
  updateResume,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addCertification,
  updateCertification,
  deleteCertification,
  addProject,
  updateProject,
  deleteProject,
  addResume,
  updateResumeEntity,
  deleteResume,
  addUserSkill,
  updateUserSkill,
  deleteUserSkill,
  addUserLanguage,
  updateUserLanguage,
  deleteUserLanguage,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  upsertJobPreferences,
};
