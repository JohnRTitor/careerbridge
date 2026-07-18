import { z } from "zod";
import { PaginationQuerySchema } from "../../shared/schemas";

export const UpdateUserRoleSchema = z
  .object({
    role: z.enum(["user", "candidate", "recruiter", "admin"]),
  })
  .meta({ id: "UpdateUserRole" });

export type UpdateUserRole = z.infer<typeof UpdateUserRoleSchema>;

export const UpdateUserStatusSchema = z
  .object({
    banned: z.boolean(),
    banReason: z.string().optional(),
  })
  .meta({ id: "UpdateUserStatus" });

export type UpdateUserStatus = z.infer<typeof UpdateUserStatusSchema>;

export const UsersQuerySchema = PaginationQuerySchema.extend({
  query: z.string().optional(),
  role: z.string().optional(),
}).meta({ id: "UsersQuery" });
export type UsersQuery = z.infer<typeof UsersQuerySchema>;

// Input Types
export type ListUsersInput = UsersQuery;

export type UpdateUserRoleInput = {
  userId: string;
  data: z.infer<typeof UpdateUserRoleSchema>;
};

export type UpdateUserStatusInput = {
  userId: string;
  data: z.infer<typeof UpdateUserStatusSchema>;
};
