import { rpcClient } from "@/lib/api/rpc";
import type { JobFilters, Job, SavedJob } from "./types";

export const searchJobs = async (filters: JobFilters) => {
  const query = {
    ...filters,
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
  };
  const res = await rpcClient.api.jobs.$get({ query });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to search jobs");
  }
  const json = await res.json();
  return json.data as unknown as { jobs: Job[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
};

export const getRecommendations = async () => {
  const res = await rpcClient.api.jobs.recommendations.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch recommendations");
  }
  const json = await res.json();
  return json.data as Job[];
};

export const getJobById = async (id: string) => {
  const res = await rpcClient.api.jobs[":id"].$get({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch job");
  }
  const json = await res.json();
  return json.data as Job;
};

export const saveJob = async (id: string) => {
  const res = await rpcClient.api.jobs[":id"].save.$post({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to save job");
  }
  const json = await res.json();
  return json.data;
};

export const unsaveJob = async (id: string) => {
  const res = await rpcClient.api.jobs[":id"].save.$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to unsave job");
  }
};

export const getSavedJobs = async () => {
  const res = await rpcClient.api.jobs.saved.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to fetch saved jobs");
  }
  const json = await res.json();
  return json.data as SavedJob[];
};
