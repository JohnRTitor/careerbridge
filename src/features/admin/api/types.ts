import type { 
  UsersQuery as UserFilters, 
  UpdateUserRole as UpdateUserRolePayload, 
  UpdateUserStatus as UpdateUserStatusPayload 
} from "@server/features/admin/admin.schemas";
import type { VerifyCompany as VerifyCompanyPayload } from "@server/features/companies/companies.schemas";
import type { PaginationQuery as AuditLogFilters } from "@server/shared/schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";

type GetUsersRes = InferResponseType<typeof rpcClient.api.admin.users.$get, 200>;
export type User = GetUsersRes extends { data: { users: (infer U)[] } } ? U : never;

export type { UserFilters, UpdateUserRolePayload, UpdateUserStatusPayload, AuditLogFilters, VerifyCompanyPayload };

type GetAuditLogsRes = InferResponseType<typeof rpcClient.api.admin["audit-logs"]["$get"], 200>;
export type AuditLog = GetAuditLogsRes extends { data: { logs: (infer L)[] } } ? L : never;
