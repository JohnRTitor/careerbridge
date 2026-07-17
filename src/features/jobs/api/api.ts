import { apiClient } from "@/lib/api/api-client";
import type { Job, JobFilters } from "./types";

export const searchJobs = (filters: JobFilters) => {
  const searchParams = new URLSearchParams();
  if (filters.q) searchParams.set("q", filters.q);
  if (filters.location) searchParams.set("location", filters.location);
  if (filters.type) searchParams.set("type", filters.type);
  if (filters.work_mode) searchParams.set("work_mode", filters.work_mode);
  if (filters.experience_level) searchParams.set("experience_level", filters.experience_level);
  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/jobs?${queryString}` : `/jobs`;
  return apiClient<{ jobs: Job[]; total: number }>(url);
};

export const getRecommendations = () => 
  apiClient<Job[]>("/jobs/recommendations");

export const getJobById = (id: string) => 
  apiClient<Job>(`/jobs/${id}`);

export const saveJob = (id: string) =>
  apiClient<void>(`/jobs/${id}/save`, { method: "POST" });

export const unsaveJob = (id: string) =>
  apiClient<void>(`/jobs/${id}/save`, { method: "DELETE" });
