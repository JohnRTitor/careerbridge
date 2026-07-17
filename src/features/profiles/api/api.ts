import { rpcClient } from "@/lib/api/rpc";
import type { 
  UpdateProfilePayload, 
  ResumeUploadPayload,
  AddEducationPayload,
  UpdateEducationPayload,
  AddExperiencePayload,
  UpdateExperiencePayload,
} from "./types";

export const getProfile = async () => {
  const res = await rpcClient.api.users.profile.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to fetch profile");
  }
  const json = await res.json();
  return json.data;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const res = await rpcClient.api.users.profile.$patch({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to update profile");
  }
  const json = await res.json();
  return json.data;
};

export const updateResume = async (data: ResumeUploadPayload) => {
  const res = await rpcClient.api.users.profile.resume.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to update resume");
  }
  const json = await res.json();
  return json.data;
};

export const addEducation = async (data: AddEducationPayload) => {
  const res = await rpcClient.api.users.profile.education.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to add education");
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
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to update education");
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
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to delete education");
  }
};

export const addExperience = async (data: AddExperiencePayload) => {
  const res = await rpcClient.api.users.profile.experience.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to add experience");
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
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to update experience");
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
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to delete experience");
  }
};
