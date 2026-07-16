import { pool } from "../../app/db";

export class CompaniesRepository {
  static async listCompanies(limit: number, offset: number, queryStr?: string) {
    let baseQuery = `SELECT * FROM companies`;
    const values: any[] = [];
    let paramIndex = 1;

    if (queryStr) {
      baseQuery += ` WHERE name ILIKE $${paramIndex} OR description ILIKE $${paramIndex}`;
      values.push(`%${queryStr}%`);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS c`;
    const countRes = await pool.query(countQuery, values);
    const total = parseInt(countRes.rows[0].count, 10);

    baseQuery += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(baseQuery, values);
    return { data: result.rows, total };
  }

  static async getCompany(id: string) {
    const query = `SELECT * FROM companies WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verifyCompany(id: string, isVerified: boolean) {
    const query = `
      UPDATE companies
      SET is_verified = $2, updated_at = now()
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id, isVerified]);
    return result.rows[0];
  }
}
