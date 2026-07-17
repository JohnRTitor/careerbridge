import { apiClient } from "@/lib/api/api-client";
import { Job } from "@/features/jobs/api/types";
import { Application } from "@/features/applications/api/types";
import type { 
  CreateJobPayload, 
  UpdateJobPayload, 
  UpdateApplicationStatusPayload 
} from "./types";

export const createJob = (data: CreateJobPayload) => 
  apiClient<Job>("/recruiters/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateJob = (id: string, data: UpdateJobPayload) => 
  apiClient<Job>(`/recruiters/jobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteJob = (id: string) => 
  apiClient<void>(`/recruiters/jobs/${id}`, {
    method: "DELETE",
  });

export const getJobApplicants = (jobId: string) => 
  apiClient<Application[]>(`/recruiters/jobs/${jobId}/applicants`);

export const updateApplicationStatus = (appId: string, data: UpdateApplicationStatusPayload) => 
  apiClient<Application>(`/recruiters/applications/${appId}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getAnalytics = () => 
  apiClient<Record<string, unknown>>("/recruiters/analytics"); // Can be typed later based on backend schema
