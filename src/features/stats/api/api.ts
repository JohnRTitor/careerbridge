import { rpcClient } from "@/lib/api/rpc";
import type { HomepageStats, JobCategory } from "./types";
import type { ErrorResponse } from "@server/shared/responses";

export const getHomepageStats = async () => {
  const res = await rpcClient.api.stats.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch homepage stats");
  }
  const json = await res.json();
  return json.data;
};

export const getJobCategories = async () => {
  const res = await rpcClient.api.stats.categories.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch job categories");
  }
  const json = await res.json();
  return json.data;
};
