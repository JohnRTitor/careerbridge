import { queryOptions, useQuery } from "@tanstack/react-query";
import { metaKeys } from "./query-keys";
import * as api from "./api";
import { SearchMetaPayload } from "./types";

export const skillsQueryOptions = (query?: string) => queryOptions({
  queryKey: metaKeys.skills(query),
  queryFn: () => api.searchSkills({ query }),
});

export const languagesQueryOptions = (query?: string) => queryOptions({
  queryKey: metaKeys.languages(query),
  queryFn: () => api.searchLanguages({ query }),
});

export const useSkills = (query?: string) => useQuery(skillsQueryOptions(query));
export const useLanguages = (query?: string) => useQuery(languagesQueryOptions(query));
