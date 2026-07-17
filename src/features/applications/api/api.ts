import { apiClient } from "@/lib/api/api-client";
import type { Application, ApplyJobPayload } from "./types";

export const getUserApplications = () => 
  apiClient<Application[]>("/applications");

export const applyForJob = (jobId: string, data: ApplyJobPayload) =>
  apiClient<Application>(`/jobs/${jobId}/apply`, {
    method: "POST",
    body: JSON.stringify(data),
  });
