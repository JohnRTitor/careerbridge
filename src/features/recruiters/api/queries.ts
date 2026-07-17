import { queryOptions, useQuery } from "@tanstack/react-query";
import { recruiterKeys } from "./query-keys";
import * as api from "./api";

export const jobApplicantsQueryOptions = (jobId: string) => queryOptions({
  queryKey: recruiterKeys.applicants(jobId),
  queryFn: () => api.getJobApplicants(jobId),
});

export const recruiterAnalyticsQueryOptions = () => queryOptions({
  queryKey: recruiterKeys.analytics(),
  queryFn: api.getAnalytics,
});

export const useJobApplicants = (jobId: string) => 
  useQuery(jobApplicantsQueryOptions(jobId));

export const useRecruiterAnalytics = () => 
  useQuery(recruiterAnalyticsQueryOptions());

export const recruiterProfileQueryOptions = () => queryOptions({
  queryKey: [...recruiterKeys.all, "profile"],
  queryFn: api.getRecruiterProfile,
});

export const useRecruiterProfile = () => useQuery(recruiterProfileQueryOptions());

export const recruiterJobsQueryOptions = (filters: { page?: number; limit?: number }) => queryOptions({
  queryKey: [...recruiterKeys.all, "jobs", filters],
  queryFn: () => api.getRecruiterJobs(filters),
});

export const useRecruiterJobs = (filters: { page?: number; limit?: number } = {}) => 
  useQuery(recruiterJobsQueryOptions(filters));

export const recruiterApplicationsQueryOptions = (filters: { page?: number; limit?: number }) => queryOptions({
  queryKey: [...recruiterKeys.all, "applications", filters],
  queryFn: () => api.getRecruiterApplications(filters),
});

export const useRecruiterApplications = (filters: { page?: number; limit?: number } = {}) => 
  useQuery(recruiterApplicationsQueryOptions(filters));
