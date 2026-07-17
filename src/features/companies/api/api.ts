import type { ErrorResponse } from "@server/shared/responses";
import { rpcClient } from "@/lib/api/rpc";
import type { 
  CompanyFilters,
  CreateCompanyPayload,
  UpdateCompanyPayload,
  AddCompanyMemberPayload,
  UpdateCompanyMemberPayload,
  Company
} from "./types";

export const listCompanies = async (filters: CompanyFilters) => {
  const query = {
    ...filters,
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
  };
  const res = await rpcClient.api.companies.$get({ query });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch companies");
  }
  const json = await res.json();
  return json.data as unknown as { companies: Company[]; pagination: { total: number; page: number; limit: number; totalPages: number } };
};

export const getCompany = async (id: string) => {
  const res = await rpcClient.api.companies[":id"].$get({
    param: { id },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch company");
  }
  const json = await res.json();
  return json.data as Company;
};

export const createCompany = async (data: CreateCompanyPayload) => {
  const res = await rpcClient.api.companies.$post({ json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to create company");
  }
  const json = await res.json();
  return json.data;
};

export const updateCompany = async (id: string, data: UpdateCompanyPayload) => {
  const res = await rpcClient.api.companies[":id"].$patch({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update company");
  }
  const json = await res.json();
  return json.data;
};

export const deleteCompany = async (id: string) => {
  const res = await rpcClient.api.companies[":id"].$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to delete company");
  }
};

export const getFollowedCompanies = async () => {
  const res = await rpcClient.api.companies.followed.me.$get();
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch followed companies");
  }
  const json = await res.json();
  return json.data;
};

export const followCompany = async (id: string) => {
  const res = await rpcClient.api.companies[":id"].follow.$post({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to follow company");
  }
};

export const unfollowCompany = async (id: string) => {
  const res = await rpcClient.api.companies[":id"].follow.$delete({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to unfollow company");
  }
};

export const getCompanyMembers = async (id: string) => {
  const res = await rpcClient.api.companies[":id"].members.$get({ param: { id } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to fetch members");
  }
  const json = await res.json();
  return json.data;
};

export const addCompanyMember = async (id: string, data: AddCompanyMemberPayload) => {
  const res = await rpcClient.api.companies[":id"].members.$post({ param: { id }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to add member");
  }
  const json = await res.json();
  return json.data;
};

export const updateCompanyMember = async (id: string, userId: string, data: UpdateCompanyMemberPayload) => {
  const res = await rpcClient.api.companies[":id"].members[":userId"].$patch({ param: { id, userId }, json: data });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to update member");
  }
  const json = await res.json();
  return json.data;
};

export const removeCompanyMember = async (id: string, userId: string) => {
  const res = await rpcClient.api.companies[":id"].members[":userId"].$delete({ param: { id, userId } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error && typeof error === "object" && "message" in error ? String((error as unknown as ErrorResponse).message) : "Failed to remove member");
  }
};
