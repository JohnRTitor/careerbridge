import { rpcClient } from "@/lib/api/rpc";
import type { 
  CreateJobPayload, 
  UpdateJobPayload, 
  UpdateApplicationStatusPayload 
} from "./types";

export const createJob = async (data: CreateJobPayload) => {
  const res = await rpcClient.api.recruiters.jobs.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to create job");
  }
  const json = await res.json();
  return json.data;
};

export const updateJob = async (id: string, data: UpdateJobPayload) => {
  const res = await rpcClient.api.recruiters.jobs[":id"].$patch({
    param: { id },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to update job");
  }
  const json = await res.json();
  return json.data;
};

export const deleteJob = async (id: string) => {
  const res = await rpcClient.api.recruiters.jobs[":id"].$delete({
    param: { id },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to delete job");
  }
};

export const getJobApplicants = async (jobId: string) => {
  const res = await rpcClient.api.recruiters.jobs[":id"].applicants.$get({
    param: { id: jobId },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to fetch applicants");
  }
  const json = await res.json();
  return json.data;
};

export const updateApplicationStatus = async (appId: string, data: UpdateApplicationStatusPayload) => {
  const res = await rpcClient.api.recruiters.applications[":id"].status.$patch({
    param: { id: appId },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to update status");
  }
  const json = await res.json();
  return json.data;
};

export const getAnalytics = async () => {
  const res = await rpcClient.api.recruiters.analytics.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to fetch analytics");
  }
  const json = await res.json();
  return json.data;
};
