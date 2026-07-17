import { queryOptions, useQuery } from "@tanstack/react-query";
import { companyKeys } from "./query-keys";
import * as api from "./api";
import { CompanyFilters } from "./types";

export const companiesQueryOptions = (filters: CompanyFilters) => queryOptions({
  queryKey: companyKeys.list(filters),
  queryFn: () => api.listCompanies(filters),
});

export const companyDetailQueryOptions = (id: string) => queryOptions({
  queryKey: companyKeys.detail(id),
  queryFn: () => api.getCompany(id),
});

export const useCompanies = (filters: CompanyFilters) => 
  useQuery(companiesQueryOptions(filters));

export const useCompany = (id: string) => 
  useQuery(companyDetailQueryOptions(id));
