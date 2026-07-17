import { rpcClient } from "@/lib/api/rpc";
import type { CompanyFilters } from "./types";

export const listCompanies = async (filters: CompanyFilters) => {
  const query = {
    ...filters,
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
  };
  const res = await rpcClient.api.companies.$get({ query });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch companies");
  }
  const json = await res.json();
  return json.data;
};

export const getCompany = async (id: string) => {
  const res = await rpcClient.api.companies[":id"].$get({
    param: { id },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch company");
  }
  const json = await res.json();
  return json.data;
};
