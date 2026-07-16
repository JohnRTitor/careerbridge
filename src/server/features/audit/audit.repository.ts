import { pool } from "../../app/db";

export class AuditRepository {
  static async logAction(data: {
    actor_id: string;
    action: string;
    target_type: string;
    target_id?: string;
    details?: any;
  }) {
    const query = `
      INSERT INTO audit_logs (actor_id, action, target_type, target_id, details)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      data.actor_id,
      data.action,
      data.target_type,
      data.target_id,
      data.details ? JSON.stringify(data.details) : null,
    ]);
    return result.rows[0];
  }

  static async getLogs(limit: number, offset: number) {
    const countQuery = `SELECT COUNT(*) FROM audit_logs`;
    const countRes = await pool.query(countQuery);
    const total = parseInt(countRes.rows[0].count, 10);

    const query = `
      SELECT a.*, u.name as actor_name, u.email as actor_email
      FROM audit_logs a
      LEFT JOIN "user" u ON a.actor_id = u.id
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    const result = await pool.query(query, [limit, offset]);
    return { data: result.rows, total };
  }
}
