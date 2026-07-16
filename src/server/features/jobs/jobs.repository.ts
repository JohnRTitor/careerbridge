import { pool } from "../../app/db";

export class JobsRepository {
  static async searchJobs(params: { query?: string; location?: string; type?: string; limit: number; offset: number }) {
    let baseQuery = `
      SELECT j.*, c.name as company_name, c.logo_url as company_logo
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'open'
    `;
    
    const values: any[] = [];
    let paramIndex = 1;

    if (params.query) {
      baseQuery += ` AND (j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`;
      values.push(`%${params.query}%`);
      paramIndex++;
    }

    if (params.location) {
      baseQuery += ` AND j.location ILIKE $${paramIndex}`;
      values.push(`%${params.location}%`);
      paramIndex++;
    }

    if (params.type) {
      baseQuery += ` AND j.type = $${paramIndex}`;
      values.push(params.type);
      paramIndex++;
    }

    const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS filtered_jobs`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count, 10);

    baseQuery += ` ORDER BY j.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(params.limit, params.offset);

    const result = await pool.query(baseQuery, values);
    return { data: result.rows, total };
  }

  static async getJobById(id: string) {
    const query = `
      SELECT j.*, c.name as company_name, c.logo_url as company_logo, c.description as company_description
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async saveJob(userId: string, jobId: string) {
    const query = `
      INSERT INTO saved_jobs (user_id, job_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, jobId]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async unsaveJob(userId: string, jobId: string) {
    const query = `
      DELETE FROM saved_jobs
      WHERE user_id = $1 AND job_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, jobId]);
    return result.rowCount ? result.rowCount > 0 : false;
  }

  static async getRecommendations(userId: string, limit: number) {
    // Simple naive recommendation: just fetch latest open jobs
    // In future, match against user_profile.headline or user_profile skills
    const query = `
      SELECT j.*, c.name as company_name, c.logo_url as company_logo
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.id
      WHERE j.status = 'open'
      ORDER BY RANDOM()
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}
