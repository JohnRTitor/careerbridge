import { queryOptions, useQuery } from "@tanstack/react-query";
import { jobsKeys } from "./query-keys";
import * as api from "./api";
import { JobFilters } from "./types";

export const jobsQueryOptions = (filters: JobFilters) => queryOptions({
  queryKey: jobsKeys.list(filters),
  queryFn: () => api.searchJobs(filters),
});

export const jobRecommendationsQueryOptions = () => queryOptions({
  queryKey: jobsKeys.recommendations(),
  queryFn: api.getRecommendations,
});

export const jobDetailQueryOptions = (id: string) => queryOptions({
  queryKey: jobsKeys.detail(id),
  queryFn: () => api.getJobById(id),
});

export const useJobs = (filters: JobFilters) => 
  useQuery(jobsQueryOptions(filters));

export const useFeaturedJobs = () =>
  useQuery({
    ...jobsQueryOptions({ is_featured: true, limit: 6, status: "open", page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

export const useLatestJobs = () =>
  useQuery({
    ...jobsQueryOptions({ limit: 6, status: "open", page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

export const useJobRecommendations = () => 
  useQuery(jobRecommendationsQueryOptions());

export const useJob = (id: string) => 
  useQuery(jobDetailQueryOptions(id));

export const savedJobsQueryOptions = () => queryOptions({
  queryKey: [...jobsKeys.all, "saved"],
  queryFn: api.getSavedJobs,
});

export const useSavedJobs = () => useQuery(savedJobsQueryOptions());
