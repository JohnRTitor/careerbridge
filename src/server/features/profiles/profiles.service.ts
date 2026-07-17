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
  DeleteExperienceInput 
} from "./profiles.schemas";

export async function getProfile(input: GetProfileInput) {
  const { userId } = input;
  const profile = await profilesRepository.getProfile({ userId });
  if (!profile) {
    return { headline: null, about: null, visibility: "public", resume_url: null, portfolio_url: null };
  }
  const education = await profilesRepository.getEducation({ userId });
  const experience = await profilesRepository.getExperience({ userId });
  return { ...profile, education, experience };
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
};
