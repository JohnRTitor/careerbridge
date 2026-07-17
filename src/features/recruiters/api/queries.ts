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
