import { rpcClient } from "@/lib/api/rpc";
import type { 
  UserFilters, 
  UpdateUserRolePayload, 
  UpdateUserStatusPayload, 
  AuditLogFilters, 
  VerifyCompanyPayload 
} from "./types";

export const getUsers = async (filters: UserFilters) => {
  const query = {
    ...filters,
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
  };
  const res = await rpcClient.api.admin.users.$get({ query });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch users");
  }
  const json = await res.json();
  return json.data;
};

export const updateUserRole = async (userId: string, data: UpdateUserRolePayload) => {
  const res = await rpcClient.api.admin.users[":id"].role.$patch({
    param: { id: userId },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to update role");
  }
  const json = await res.json();
  return json.data;
};

export const updateUserStatus = async (userId: string, data: UpdateUserStatusPayload) => {
  const res = await rpcClient.api.admin.users[":id"].status.$patch({
    param: { id: userId },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to update status");
  }
  const json = await res.json();
  return json.data;
};

export const getAuditLogs = async (filters: AuditLogFilters) => {
  const query = {
    ...filters,
    page: filters.page?.toString(),
    limit: filters.limit?.toString(),
  };
  const res = await rpcClient.api.admin["audit-logs"].$get({ query });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to fetch audit logs");
  }
  const json = await res.json();
  return json.data;
};

export const verifyCompany = async (companyId: string, data: VerifyCompanyPayload) => {
  const res = await rpcClient.api.admin.companies[":id"].verify.$patch({
    param: { id: companyId },
    json: data,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error("message" in error ? error.message : "Failed to verify company");
  }
  const json = await res.json();
  return json.data;
};
