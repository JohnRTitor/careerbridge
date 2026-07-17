import { queryOptions, useQuery } from "@tanstack/react-query";
import { profileKeys } from "./query-keys";
import { getProfile, getResumes, getJobPreferences, getPublicProfile } from "./api";

export const profileQueryOptions = () => queryOptions({
  queryKey: profileKeys.profile(),
  queryFn: getProfile,
});

export const useProfile = () => useQuery(profileQueryOptions());

export const resumesQueryOptions = () => queryOptions({
  queryKey: [...profileKeys.profile(), "resumes"],
  queryFn: getResumes,
});

export const useResumes = () => useQuery(resumesQueryOptions());

export const jobPreferencesQueryOptions = () => queryOptions({
  queryKey: [...profileKeys.profile(), "preferences"],
  queryFn: getJobPreferences,
});

export const useJobPreferences = () => useQuery(jobPreferencesQueryOptions());

export const publicProfileQueryOptions = (userId: string) => queryOptions({
  queryKey: ["publicProfile", userId],
  queryFn: () => getPublicProfile(userId),
});

export const usePublicProfile = (userId: string) => useQuery(publicProfileQueryOptions(userId));
