import { apiClient } from "@/lib/api/api-client";
import { Company } from "@/features/companies/api/types";
import type { 
  User, 
  UserFilters, 
  UpdateUserRolePayload, 
  UpdateUserStatusPayload, 
  AuditLog, 
  AuditLogFilters, 
  VerifyCompanyPayload 
} from "./types";

export const getUsers = (filters: UserFilters) => {
  const searchParams = new URLSearchParams();
  if (filters.q) searchParams.set("q", filters.q);
  if (filters.role) searchParams.set("role", filters.role);
  if (filters.banned !== undefined) searchParams.set("banned", filters.banned.toString());
  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/admin/users?${queryString}` : `/admin/users`;
  return apiClient<{ users: User[]; total: number }>(url);
};

export const updateUserRole = (userId: string, data: UpdateUserRolePayload) => 
  apiClient<User>(`/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const updateUserStatus = (userId: string, data: UpdateUserStatusPayload) => 
  apiClient<User>(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const getAuditLogs = (filters: AuditLogFilters) => {
  const searchParams = new URLSearchParams();
  if (filters.page) searchParams.set("page", filters.page.toString());
  if (filters.limit) searchParams.set("limit", filters.limit.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/admin/audit-logs?${queryString}` : `/admin/audit-logs`;
  return apiClient<{ logs: AuditLog[]; total: number }>(url);
};

export const verifyCompany = (companyId: string, data: VerifyCompanyPayload) => 
  apiClient<Company>(`/admin/companies/${companyId}/verify`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
