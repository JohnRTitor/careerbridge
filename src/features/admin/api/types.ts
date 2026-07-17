import { z } from "zod";
import { InferRequestType, InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";
import { UsersQuerySchema, UpdateUserRoleSchema, UpdateUserStatusSchema } from "@server/features/admin/admin.schemas";
import { VerifyCompanySchema } from "@server/features/companies/companies.schemas";
import { PaginationQuerySchema } from "@server/shared/schemas";

type GetUsersRes = InferResponseType<typeof rpcClient.api.admin.users.$get, 200>;
export type User = GetUsersRes extends { data: { users: (infer U)[] } } ? U : never;

export type UserFilters = z.infer<typeof UsersQuerySchema>;
export type UpdateUserRolePayload = z.infer<typeof UpdateUserRoleSchema>;
export type UpdateUserStatusPayload = z.infer<typeof UpdateUserStatusSchema>;

export type AuditLogFilters = z.infer<typeof PaginationQuerySchema>;

type GetAuditLogsRes = InferResponseType<typeof rpcClient.api.admin["audit-logs"]["$get"], 200>;
export type AuditLog = GetAuditLogsRes extends { data: { logs: (infer L)[] } } ? L : never;

export type VerifyCompanyPayload = z.infer<typeof VerifyCompanySchema>;
