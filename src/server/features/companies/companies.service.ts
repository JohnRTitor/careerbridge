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

export async function createCompany(input: any) {
  return companiesRepository.createCompany(input);
}

export async function updateCompany(input: any) {
  const result = await companiesRepository.updateCompany(input);
  if (!result) throw new NotFoundError("Company not found");
  return result;
}

export async function deleteCompany(input: any) {
  const success = await companiesRepository.deleteCompany(input);
  if (!success) throw new NotFoundError("Company not found");
}

export async function followCompany(input: any) {
  return companiesRepository.followCompany(input);
}

export async function unfollowCompany(input: any) {
  return companiesRepository.unfollowCompany(input);
}

export async function getFollowedCompanies(input: any) {
  return companiesRepository.getFollowedCompanies(input);
}

export async function addCompanyMember(input: any) {
  return companiesRepository.addCompanyMember(input);
}

export async function updateCompanyMember(input: any) {
  const result = await companiesRepository.updateCompanyMember(input);
  if (!result) throw new NotFoundError("Company member not found");
  return result;
}

export async function removeCompanyMember(input: any) {
  const success = await companiesRepository.removeCompanyMember(input);
  if (!success) throw new NotFoundError("Company member not found");
}

export async function getCompanyMembers(input: any) {
  return companiesRepository.getCompanyMembers(input);
}

export const companiesService = {
  listCompanies,
  getCompany,
  verifyCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
  addCompanyMember,
  updateCompanyMember,
  removeCompanyMember,
  getCompanyMembers,
};
