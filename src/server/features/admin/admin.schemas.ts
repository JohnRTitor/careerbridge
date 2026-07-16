import { z } from "zod";
import "zod-openapi";
import { PaginationQuerySchema } from "../../shared/schemas";

export const UpdateUserRoleSchema = z.object({
  role: z.enum(["user", "candidate", "recruiter", "admin"]),
}).meta({ id: "UpdateUserRole" });

export const UpdateUserStatusSchema = z.object({
  banned: z.boolean(),
  banReason: z.string().optional(),
}).meta({ id: "UpdateUserStatus" });

export const UsersQuerySchema = PaginationQuerySchema.extend({
  query: z.string().optional(),
  role: z.string().optional(),
}).meta({ id: "UsersQuery" });
