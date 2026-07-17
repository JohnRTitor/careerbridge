import { apiClient } from "@/lib/api/api-client";
import type { 
  Profile, 
  UpdateProfilePayload, 
  ResumeUploadPayload,
  AddEducationPayload,
  UpdateEducationPayload,
  Education,
  AddExperiencePayload,
  UpdateExperiencePayload,
  Experience
} from "./types";

export const getProfile = () => 
  apiClient<Profile>("/users/profile");

export const updateProfile = (data: UpdateProfilePayload) => 
  apiClient<Profile>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const updateResume = (data: ResumeUploadPayload) =>
  apiClient<Profile>("/users/profile/resume", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const addEducation = (data: AddEducationPayload) =>
  apiClient<Education>("/users/profile/education", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateEducation = (id: string, data: UpdateEducationPayload) =>
  apiClient<Education>(`/users/profile/education/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteEducation = (id: string) =>
  apiClient<void>(`/users/profile/education/${id}`, {
    method: "DELETE",
  });

export const addExperience = (data: AddExperiencePayload) =>
  apiClient<Experience>("/users/profile/experience", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateExperience = (id: string, data: UpdateExperiencePayload) =>
  apiClient<Experience>(`/users/profile/experience/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteExperience = (id: string) =>
  apiClient<void>(`/users/profile/experience/${id}`, {
    method: "DELETE",
  });
