import { adminRepository } from "./admin.repository";
import { NotFoundError } from "../../shared/errors";
import type { ListUsersInput, UpdateUserRoleInput, UpdateUserStatusInput } from "./admin.schemas";

export async function listUsers(input: ListUsersInput) {
  const { page = 1, limit = 10 } = input;
  const offset = (page - 1) * limit;

  const { data, total } = await adminRepository.listUsers({ ...input, offset });
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

export async function updateUserRole(input: UpdateUserRoleInput) {
  const user = await adminRepository.updateUserRole(input);
  if (!user) throw new NotFoundError("User not found");
  return user;
}

export async function updateUserStatus(input: UpdateUserStatusInput) {
  const user = await adminRepository.updateUserStatus(input);
  if (!user) throw new NotFoundError("User not found");
  return user;
}

export const adminService = {
  listUsers,
  updateUserRole,
  updateUserStatus,
};
