import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  updateProfile,
  addEducation,
  editEducationById,
  deleteEducationById,
  addExperience,
  editExperienceById,
  deleteExperienceById,
} from "./profile.apis";

import type {
  UpdateProfilePayload,
  AddEducationPayload,
  AddExperiencePayload,
} from "./profile.apis.schema";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),

    onSuccess: (response: any) => {
      if (response.success) {
        toast.success("Profile updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      } else {
        toast.error(response.error?.details || "Something went wrong");
      }
    },

    onError: () => {
      toast.error("Profile update failed.");
    },
  });
}

export function useAddEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEducation,

    onSuccess: (response: any) => {
      if (response.success) {
        toast.success("Education added successfully.");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      } else {
        toast.error(response.error?.details || "Something went wrong");
      }
    },

    onError: () => toast.error("Failed to add education."),
  });
}

export function useEditEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddEducationPayload;
    }) => editEducationById(id, payload),

    onSuccess: (response: any) => {
      if (response.success) {
        toast.success("Education updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      } else {
        toast.error(response.error?.details || "Something went wrong");
      }
    },

    onError: () => toast.error("Failed to update education."),
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEducationById(id),

    onSuccess: (response: any) => {
      if (response.success) {
        toast.success("Education deleted successfully.");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      } else {
        toast.error(response.error?.details || "Something went wrong");
      }
    },

    onError: () => toast.error("Failed to delete education."),
  });
}

export function useAddExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addExperience,

    onSuccess: (response: any) => {
      if (response.success) {
        toast.success("Experience added successfully.");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      } else {
        toast.error(response.error?.details || "Something went wrong");
      }
    },

    onError: () => toast.error("Failed to add experience."),
  });
}

export function useEditExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: AddExperiencePayload;
    }) => editExperienceById(id, payload),

    onSuccess: (response: any) => {
      if (response.success) {
        toast.success("Experience updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      } else {
        toast.error(response.error?.details || "Something went wrong");
      }
    },

    onError: () => toast.error("Failed to update experience."),
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExperienceById(id),

    onSuccess: (response: any) => {
      if (response.success) {
        toast.success("Experience deleted successfully.");
        queryClient.invalidateQueries({ queryKey: ["get-profile"] });
      } else {
        toast.error(response.error?.details || "Something went wrong");
      }
    },

    onError: () => toast.error("Failed to delete experience."),
  });
}
