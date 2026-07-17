import type { ErrorResponse } from "@server/shared/responses";
import { rpcClient } from "@/lib/api/rpc";
import type { 
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
} from "./types";

export const getProfile = async () => {
  const res = await rpcClient.api.users.profile.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch profile");
  }
  const json = await res.json();
  return json.data;
};

export const getPublicProfile = async (userId: string) => {
  const res = await rpcClient.api.u[":userId"].$get({ param: { userId } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch public profile");
  }
  const json = await res.json();
  return json.data;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const res = await rpcClient.api.users.profile.$patch({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update profile");
  }
  const json = await res.json();
  return json.data;
};

export const updateResume = async (data: ResumeUploadPayload) => {
  const res = await rpcClient.api.users.profile.resume.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update resume");
  }
  const json = await res.json();
  return json.data;
};

export const addEducation = async (data: AddEducationPayload) => {
  const res = await rpcClient.api.users.profile.education.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add education");
  }
  const json = await res.json();
  return json.data;
};

export const updateEducation = async (id: string, data: UpdateEducationPayload) => {
  const res = await rpcClient.api.users.profile.education[":id"].$patch({
    param: { id },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update education");
  }
  const json = await res.json();
  return json.data;
};

export const deleteEducation = async (id: string) => {
  const res = await rpcClient.api.users.profile.education[":id"].$delete({
    param: { id },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete education");
  }
};

export const addExperience = async (data: AddExperiencePayload) => {
  const res = await rpcClient.api.users.profile.experience.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add experience");
  }
  const json = await res.json();
  return json.data;
};

export const updateExperience = async (id: string, data: UpdateExperiencePayload) => {
  const res = await rpcClient.api.users.profile.experience[":id"].$patch({
    param: { id },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update experience");
  }
  const json = await res.json();
  return json.data;
};

export const deleteExperience = async (id: string) => {
  const res = await rpcClient.api.users.profile.experience[":id"].$delete({
    param: { id },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete experience");
  }
};

export const addCertification = async (data: AddCertificationPayload) => {
  const res = await rpcClient.api.users.profile.certifications.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add certification");
  }
  const json = await res.json();
  return json.data;
};

export const updateCertification = async (id: string, data: UpdateCertificationPayload) => {
  const res = await rpcClient.api.users.profile.certifications[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update certification");
  }
  const json = await res.json();
  return json.data;
};

export const deleteCertification = async (id: string) => {
  const res = await rpcClient.api.users.profile.certifications[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete certification");
  }
};

export const addProject = async (data: AddProjectPayload) => {
  const res = await rpcClient.api.users.profile.projects.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add project");
  }
  const json = await res.json();
  return json.data;
};

export const updateProject = async (id: string, data: UpdateProjectPayload) => {
  const res = await rpcClient.api.users.profile.projects[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update project");
  }
  const json = await res.json();
  return json.data;
};

export const deleteProject = async (id: string) => {
  const res = await rpcClient.api.users.profile.projects[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete project");
  }
};

export const getResumes = async () => {
  const res = await rpcClient.api.users.profile.resumes.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch resumes");
  }
  const json = await res.json();
  return json.data;
};

export const addResume = async (data: AddResumePayload) => {
  const res = await rpcClient.api.users.profile.resumes.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add resume");
  }
  const json = await res.json();
  return json.data;
};

export const updateResumeEntity = async (id: string, data: UpdateResumeEntityPayload) => {
  const res = await rpcClient.api.users.profile.resumes[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update resume");
  }
  const json = await res.json();
  return json.data;
};

export const deleteResume = async (id: string) => {
  const res = await rpcClient.api.users.profile.resumes[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete resume");
  }
};

export const addUserSkill = async (data: AddUserSkillPayload) => {
  const res = await rpcClient.api.users.profile.skills.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add skill");
  }
  const json = await res.json();
  return json.data;
};

export const updateUserSkill = async (id: string, data: UpdateUserSkillPayload) => {
  const res = await rpcClient.api.users.profile.skills[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update skill");
  }
  const json = await res.json();
  return json.data;
};

export const deleteUserSkill = async (id: string) => {
  const res = await rpcClient.api.users.profile.skills[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete skill");
  }
};

export const addUserLanguage = async (data: AddUserLanguagePayload) => {
  const res = await rpcClient.api.users.profile.languages.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add language");
  }
  const json = await res.json();
  return json.data;
};

export const updateUserLanguage = async (id: string, data: UpdateUserLanguagePayload) => {
  const res = await rpcClient.api.users.profile.languages[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update language");
  }
  const json = await res.json();
  return json.data;
};

export const deleteUserLanguage = async (id: string) => {
  const res = await rpcClient.api.users.profile.languages[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete language");
  }
};

export const addSocialLink = async (data: AddSocialLinkPayload) => {
  const res = await rpcClient.api.users.profile["social-links"].$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add social link");
  }
  const json = await res.json();
  return json.data;
};

export const updateSocialLink = async (id: string, data: UpdateSocialLinkPayload) => {
  const res = await rpcClient.api.users.profile["social-links"][":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update social link");
  }
  const json = await res.json();
  return json.data;
};

export const deleteSocialLink = async (id: string) => {
  const res = await rpcClient.api.users.profile["social-links"][":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete social link");
  }
};

export const getJobPreferences = async () => {
  const res = await rpcClient.api.users.profile.preferences.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch job preferences");
  }
  const json = await res.json();
  return json.data;
};

export const updateJobPreferences = async (data: JobPreferencePayload) => {
  const res = await rpcClient.api.users.profile.preferences.$put({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update job preferences");
  }
  const json = await res.json();
  return json.data;
};
