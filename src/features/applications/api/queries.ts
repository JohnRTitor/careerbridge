import { queryOptions, useQuery } from "@tanstack/react-query";
import { applicationKeys } from "./query-keys";
import * as api from "./api";

export const userApplicationsQueryOptions = () => queryOptions({
  queryKey: applicationKeys.list(),
  queryFn: api.getUserApplications,
});

export const useUserApplications = () => 
  useQuery(userApplicationsQueryOptions());
