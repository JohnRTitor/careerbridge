import { rpcClient, handleRpcError } from "@/lib/api/rpc";
import type { JobFilters, Job, SavedJob } from "./types";

export const searchJobs = async (filters: JobFilters) => {
  const query = {
    ...filters,
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
    companyId: filters.companyId,
    is_featured: filters.is_featured !== undefined ? String(filters.is_featured) : undefined,
  };
  const res = await rpcClient.api.jobs.$get({ query });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const getRecommendations = async () => {
  const res = await rpcClient.api.jobs.recommendations.$get();
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const getJobById = async (id: string) => {
  const res = await rpcClient.api.jobs[":id"].$get({ param: { id } });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const saveJob = async (id: string) => {
  const res = await rpcClient.api.jobs[":id"].save.$post({ param: { id } });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const unsaveJob = async (id: string) => {
  const res = await rpcClient.api.jobs[":id"].save.$delete({ param: { id } });
  if (!res.ok) return handleRpcError(res);
};

export const getSavedJobs = async () => {
  const res = await rpcClient.api.jobs.saved.$get();
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};
