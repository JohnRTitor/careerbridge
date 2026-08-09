import { companiesService } from "@server/features/companies/companies.service";
import type { ListCompaniesInput, GetCompanyInput } from "@server/features/companies/companies.schemas";
import { cacheTag } from "next/cache";

export async function listCompaniesCached(input: ListCompaniesInput) {
  "use cache";
  cacheTag("companies", "companies:list");
  return companiesService.listCompanies(input);
}

export async function getCompanyCached(input: GetCompanyInput) {
  "use cache";
  cacheTag("companies", "companies:detail", `companies:detail:${input.companyId}`);
  return companiesService.getCompany(input);
}
