import { rpcClient, handleRpcError } from "@/lib/api/rpc";
import type { ApplyJobPayload, Application } from "./types";

export const getUserApplications = async () => {
  const res = await rpcClient.api.applications.$get();
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const applyForJob = async (jobId: string, data: ApplyJobPayload) => {
  const res = await rpcClient.api.jobs[":id"].apply.$post({
    param: { id: jobId },
    json: data,
  });
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};
export const withdrawApplication = async (id: string) => {
  const res = await rpcClient.api.applications[":id"].$delete({ param: { id } });
  if (!res.ok) return handleRpcError(res);
};
