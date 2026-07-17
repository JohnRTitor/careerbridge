import { queryOptions, useQuery } from "@tanstack/react-query";
import { statsKeys } from "./query-keys";
import * as api from "./api";

export const homepageStatsQueryOptions = () => queryOptions({
  queryKey: statsKeys.homepage(),
  queryFn: api.getHomepageStats,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});

export const jobCategoriesQueryOptions = () => queryOptions({
  queryKey: statsKeys.categories(),
  queryFn: api.getJobCategories,
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
});

export const useHomepageStats = () => useQuery(homepageStatsQueryOptions());
export const useJobCategories = () => useQuery(jobCategoriesQueryOptions());
