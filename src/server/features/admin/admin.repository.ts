import { pool } from "../../app/db";

export class AdminRepository {
  static async listUsers(limit: number, offset: number, queryStr?: string, role?: string) {
    let baseQuery = `SELECT id, name, email, role, banned, "banReason" as ban_reason, "createdAt" as created_at FROM "user"`;
    const values: any[] = [];
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

  static async updateUserRole(id: string, role: string) {
    const query = `
      UPDATE "user"
      SET role = $2, "updatedAt" = now()
      WHERE id = $1
      RETURNING id, name, email, role;
    `;
    const result = await pool.query(query, [id, role]);
    return result.rows[0];
  }

  static async updateUserStatus(id: string, banned: boolean, banReason?: string) {
    const query = `
      UPDATE "user"
      SET banned = $2, "banReason" = $3, "updatedAt" = now()
      WHERE id = $1
      RETURNING id, name, email, banned, "banReason" as ban_reason;
    `;
    const result = await pool.query(query, [id, banned, banReason || null]);
    return result.rows[0];
  }
}
