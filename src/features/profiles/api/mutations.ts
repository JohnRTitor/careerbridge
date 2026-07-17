import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "./query-keys";
import * as api from "./api";
import type { UpdateEducationPayload, UpdateExperiencePayload } from "./types";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.updateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationPayload }) =>
      api.updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useAddExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.addExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperiencePayload }) =>
      api.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.profile() });
    },
  });
};
