import { queryOptions, useQuery } from "@tanstack/react-query";
import { metaKeys } from "./query-keys";
import * as api from "./api";
export const skillsQueryOptions = (query?: string) => queryOptions({
  queryKey: metaKeys.skills(query),
  queryFn: () => api.searchSkills({ query, limit: 50 }),
});

export const languagesQueryOptions = (query?: string) => queryOptions({
  queryKey: metaKeys.languages(query),
  queryFn: () => api.searchLanguages({ query, limit: 50 }),
});

export const currenciesQueryOptions = () => queryOptions({
  queryKey: metaKeys.currencies(),
  queryFn: () => api.getCurrencies(),
  staleTime: Infinity, // currencies don't change often
});

export const useSkills = (query?: string) => useQuery(skillsQueryOptions(query));
export const useLanguages = (query?: string) => useQuery(languagesQueryOptions(query));
export const useCurrencies = () => useQuery(currenciesQueryOptions());
