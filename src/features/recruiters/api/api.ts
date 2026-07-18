import { rpcClient, handleRpcError } from "@/lib/api/rpc";
import type { 
  CreateJobPayload, 
  UpdateJobPayload, 
  UpdateApplicationStatusPayload,
  UpdateRecruiterProfilePayload
} from "./types";

export const getRecruiterProfile = async () => {
  const res = await rpcClient.api.recruiters.profile.$get();
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const upsertRecruiterProfile = async (data: UpdateRecruiterProfilePayload) => {
  const res = await rpcClient.api.recruiters.profile.$put({ json: data });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const createJob = async (data: CreateJobPayload) => {
  const res = await rpcClient.api.recruiters.jobs.$post({ json: data });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const updateJob = async (id: string, data: UpdateJobPayload) => {
  const res = await rpcClient.api.recruiters.jobs[":id"].$patch({
    param: { id },
    json: data,
  });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const deleteJob = async (id: string) => {
  const res = await rpcClient.api.recruiters.jobs[":id"].$delete({
    param: { id },
  });
  if (!res.ok) return handleRpcError(res);
};

export const getJobApplicants = async (jobId: string) => {
  const res = await rpcClient.api.recruiters.jobs[":id"].applicants.$get({
    param: { id: jobId },
  });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const updateApplicationStatus = async (appId: string, data: UpdateApplicationStatusPayload) => {
  const res = await rpcClient.api.recruiters.applications[":id"].status.$patch({
    param: { id: appId },
    json: data,
  });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const getAnalytics = async () => {
  const res = await rpcClient.api.recruiters.analytics.$get();
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const getRecruiterJobs = async (filters: { page?: number; limit?: number } = {}) => {
  const query = {
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
  };
  const res = await rpcClient.api.recruiters.jobs.$get({ query });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const getRecruiterApplications = async (filters: { page?: number; limit?: number } = {}) => {
  const query = {
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
  };
  const res = await rpcClient.api.recruiters.applications.$get({ query });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};
