import { pool } from "../../app/db";
import type { SearchJobsInput, GetJobByIdInput, SaveJobInput, UnsaveJobInput, GetRecommendationsInput, GetSavedJobsInput } from "./jobs.schemas";

export async function searchJobs(input: SearchJobsInput & { limit: number; offset: number }) {
  const { query: queryStr, location, type, is_featured, status = 'open', limit, offset } = input;
  let baseQuery = `
    SELECT j.*, c.name as company_name, c.logo_url as company_logo
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.status = $1
  `;
  
  const values: unknown[] = [status];
  let paramIndex = 2;

  if (queryStr) {
    baseQuery += ` AND (j.title ILIKE $${paramIndex} OR j.description ILIKE $${paramIndex})`;
    values.push(`%${queryStr}%`);
    paramIndex++;
  }

  if (location) {
    baseQuery += ` AND j.location ILIKE $${paramIndex}`;
    values.push(`%${location}%`);
    paramIndex++;
  }

  if (type) {
    baseQuery += ` AND j.type = $${paramIndex}`;
    values.push(type);
    paramIndex++;
  }

  if (is_featured !== undefined) {
    baseQuery += ` AND j.is_featured = $${paramIndex}`;
    values.push(is_featured);
    paramIndex++;
  }

  if (input.companyId) {
    baseQuery += ` AND j.company_id = $${paramIndex}`;
    values.push(input.companyId);
    paramIndex++;
  }

  const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS filtered_jobs`;
  const countResult = await pool.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);

  baseQuery += ` ORDER BY j.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  const result = await pool.query(baseQuery, values);
  return { data: result.rows, total };
}

export async function getJobById(input: GetJobByIdInput) {
  const { jobId } = input;
  const query = `
    SELECT j.*, c.name as company_name, c.logo_url as company_logo, c.description as company_description
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE j.id = $1
  `;
  const result = await pool.query(query, [jobId]);
  return result.rows[0];
}

export async function saveJob(input: SaveJobInput) {
  const { userId, jobId } = input;
  const query = `
    INSERT INTO saved_jobs (user_id, job_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, jobId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export async function unsaveJob(input: UnsaveJobInput) {
  const { userId, jobId } = input;
  const query = `
    DELETE FROM saved_jobs
    WHERE user_id = $1 AND job_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, jobId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export async function getRecommendations(input: GetRecommendationsInput & { limit: number }) {
  const { limit } = input;
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
export async function getSavedJobs(input: GetSavedJobsInput) {
  const { userId } = input;
  const query = `
    SELECT j.*, c.name as company_name, c.logo_url as company_logo, sj.saved_at
    FROM saved_jobs sj
    JOIN jobs j ON sj.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE sj.user_id = $1
    ORDER BY sj.saved_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export const jobsRepository = {
  searchJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getRecommendations,
  getSavedJobs,
};
