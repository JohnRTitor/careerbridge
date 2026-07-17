import { companiesRepository } from "./companies.repository";
import { NotFoundError } from "../../shared/errors";
import type { ListCompaniesInput, GetCompanyInput, VerifyCompanyInput } from "./companies.schemas";

export async function listCompanies(input: ListCompaniesInput) {
  const { page = 1, limit = 10 } = input;
  const offset = (page - 1) * limit;

  const { data, total } = await companiesRepository.listCompanies({ ...input, offset });
  return {
    companies: data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCompany(input: GetCompanyInput) {
  const company = await companiesRepository.getCompany(input);
  if (!company) throw new NotFoundError("Company not found");
  return company;
}

export async function verifyCompany(input: VerifyCompanyInput) {
  const company = await companiesRepository.verifyCompany(input);
  if (!company) throw new NotFoundError("Company not found");
  return company;
}

export const companiesService = {
  listCompanies,
  getCompany,
  verifyCompany,
};
