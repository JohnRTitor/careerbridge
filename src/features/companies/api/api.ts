import { apiClient } from "@/lib/api/api-client";
import type { Company, CompanyFilters } from "./types";

export const listCompanies = (filters: CompanyFilters) => {
  const searchParams = new URLSearchParams();
  if (filters.q) searchParams.set("q", filters.q);
  if (filters.industry) searchParams.set("industry", filters.industry);
  if (filters.location) searchParams.set("location", filters.location);
  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/companies?${queryString}` : `/companies`;
  return apiClient<{ companies: Company[]; total: number }>(url);
};

export const getCompany = (id: string) => 
  apiClient<Company>(`/companies/${id}`);
