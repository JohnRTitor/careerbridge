import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsKeys } from "./query-keys";
import type { JobApplicationForm } from "@server/features/jobs/jobs.schemas";
import * as api from "./api";

export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveJob,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobsKeys.saved() });
    },
  });
};

export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.unsaveJob,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobsKeys.saved() });
    },
  });
};

export const useUpdateJobApplicationForm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: JobApplicationForm }) => 
      api.updateJobApplicationForm(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...jobsKeys.detail(id), "application-form"] });
    },
  });
};
