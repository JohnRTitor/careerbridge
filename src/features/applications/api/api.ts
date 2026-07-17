import { rpcClient } from "@/lib/api/rpc";
import type { ApplyJobPayload } from "./types";

export const getUserApplications = async () => {
  const res = await rpcClient.api.applications.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch applications");
  }
  const json = await res.json();
  return json.data;
};

export const applyForJob = async (jobId: string, data: ApplyJobPayload) => {
  const res = await rpcClient.api.jobs[":id"].apply.$post({
    param: { id: jobId },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to apply for job");
  }
  const json = await res.json();
  return json.data;
};
export const withdrawApplication = async (id: string) => {
  const res = await rpcClient.api.applications[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as any).message) : "Failed to withdraw application");
  }
};
