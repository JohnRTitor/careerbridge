import { UserFilters, AuditLogFilters } from "./types";

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (filters: UserFilters) => [...adminKeys.users(), filters] as const,
  auditLogs: () => [...adminKeys.all, 'audit-logs'] as const,
  auditLogList: (filters: AuditLogFilters) => [...adminKeys.auditLogs(), filters] as const,
};
