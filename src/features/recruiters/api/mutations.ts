import { useMutation, useQueryClient } from "@tanstack/react-query";
import { recruiterKeys } from "./query-keys";
import { jobsKeys } from "@/features/jobs/api/query-keys";
import * as api from "./api";
import type { UpdateJobPayload, UpdateApplicationStatusPayload } from "./types";

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobPayload }) => 
      api.updateJob(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteJob,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, data }: { appId: string; data: UpdateApplicationStatusPayload }) => 
      api.updateApplicationStatus(appId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruiterKeys.all });
    },
  });
};
