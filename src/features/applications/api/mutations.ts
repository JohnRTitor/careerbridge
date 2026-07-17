import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationKeys } from "./query-keys";
import * as api from "./api";
import type { ApplyJobPayload } from "./types";

export const useApplyForJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: ApplyJobPayload }) => 
      api.applyForJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
    },
  });
};
