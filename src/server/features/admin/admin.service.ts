import { AdminRepository } from "./admin.repository";
import { NotFoundError } from "../../shared/errors";
import { z } from "zod";
import { UsersQuerySchema, UpdateUserRoleSchema, UpdateUserStatusSchema } from "./admin.schemas";

export class AdminService {
  static async listUsers(params: z.infer<typeof UsersQuerySchema>) {
    const { page = 1, limit = 10, query, role } = params;
    const offset = (page - 1) * limit;

    const { data, total } = await AdminRepository.listUsers(limit, offset, query, role);
    return {
      users: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async updateUserRole(id: string, role: string) {
    const user = await AdminRepository.updateUserRole(id, role);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }

  static async updateUserStatus(id: string, data: z.infer<typeof UpdateUserStatusSchema>) {
    const user = await AdminRepository.updateUserStatus(id, data.banned, data.banReason);
    if (!user) throw new NotFoundError("User not found");
    return user;
  }
}
