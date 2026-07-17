import { pool } from "../../app/db";
import type { ListUsersInput, UpdateUserRoleInput, UpdateUserStatusInput } from "./admin.schemas";

export async function listUsers(input: ListUsersInput & { offset: number }) {
  const { limit = 10, offset, query: queryStr, role } = input;
  let baseQuery = `SELECT id, name, email, role, banned, "banReason" as ban_reason, "createdAt" as created_at FROM "user"`;
  const values: (string | number)[] = [];
  let paramIndex = 1;

  const conditions = [];

  if (queryStr) {
    conditions.push(`(name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
    values.push(`%${queryStr}%`);
    paramIndex++;
  }

  if (role) {
    conditions.push(`role = $${paramIndex}`);
    values.push(role);
    paramIndex++;
  }

  if (conditions.length > 0) {
    baseQuery += ` WHERE ` + conditions.join(' AND ');
  }

  const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS u`;
  const countRes = await pool.query(countQuery, values);
  const total = parseInt(countRes.rows[0].count, 10);

  baseQuery += ` ORDER BY "createdAt" DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  const result = await pool.query(baseQuery, values);
  return { data: result.rows, total };
}

export async function updateUserRole(input: UpdateUserRoleInput) {
  const { userId, data } = input;
  const query = `
    UPDATE "user"
    SET role = $2, "updatedAt" = now()
    WHERE id = $1
    RETURNING id, name, email, role;
  `;
  const result = await pool.query(query, [userId, data.role]);
  return result.rows[0];
}

export async function updateUserStatus(input: UpdateUserStatusInput) {
  const { userId, data } = input;
  const query = `
    UPDATE "user"
    SET banned = $2, "banReason" = $3, "updatedAt" = now()
    WHERE id = $1
    RETURNING id, name, email, banned, "banReason" as ban_reason;
  `;
  const result = await pool.query(query, [userId, data.banned, data.banReason || null]);
  return result.rows[0];
}

export const adminRepository = {
  listUsers,
  updateUserRole,
  updateUserStatus,
};
