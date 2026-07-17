import { queryOptions, useQuery } from "@tanstack/react-query";
import { adminKeys } from "./query-keys";
import * as api from "./api";
import { UserFilters, AuditLogFilters } from "./types";

export const adminUsersQueryOptions = (filters: UserFilters) => queryOptions({
  queryKey: adminKeys.userList(filters),
  queryFn: () => api.getUsers(filters),
});

export const auditLogsQueryOptions = (filters: AuditLogFilters) => queryOptions({
  queryKey: adminKeys.auditLogList(filters),
  queryFn: () => api.getAuditLogs(filters),
});

export const useAdminUsers = (filters: UserFilters) => 
  useQuery(adminUsersQueryOptions(filters));

export const useAuditLogs = (filters: AuditLogFilters) => 
  useQuery(auditLogsQueryOptions(filters));
