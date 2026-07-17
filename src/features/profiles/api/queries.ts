import { queryOptions, useQuery } from "@tanstack/react-query";
import { profileKeys } from "./query-keys";
import { getProfile } from "./api";

export const profileQueryOptions = () => queryOptions({
  queryKey: profileKeys.profile(),
  queryFn: getProfile,
});

export const useProfile = () => useQuery(profileQueryOptions());
