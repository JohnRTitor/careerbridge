import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsKeys } from "./query-keys";
import * as api from "./api";

export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.saveJob,
    onSuccess: (_, jobId) => {
      queryClient.invalidateQueries({ queryKey: jobsKeys.detail(jobId) });
      queryClient.invalidateQueries({ queryKey: jobsKeys.lists() });
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
    },
  });
};
