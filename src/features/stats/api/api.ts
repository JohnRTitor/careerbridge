import { rpcClient, handleRpcError } from "@/lib/api/rpc";
import type { HomepageStats, JobCategory } from "./types";

export const getHomepageStats = async () => {
  const res = await rpcClient.api.stats.$get();
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};

export const getJobCategories = async () => {
  const res = await rpcClient.api.stats.categories.$get();
  if (!res.ok) return handleRpcError(res);
  const json = await res.json();
  return json.data;
};
