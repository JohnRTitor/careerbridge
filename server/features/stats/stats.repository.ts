import { pool } from "../../app/db";

export async function getHomepageStats() {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM jobs WHERE status = 'open')::int AS total_open_jobs,
      (SELECT COUNT(*) FROM jobs)::int AS total_jobs,
      (SELECT COUNT(*) FROM companies)::int AS total_companies,
      (SELECT COUNT(*) FROM "user")::int AS total_users,
      (SELECT COUNT(*) FROM applications)::int AS total_applications
  `;
  const result = await pool.query(query);
  return result.rows[0];
}

export async function getJobCategories() {
  const query = `
    SELECT c.industry, COUNT(j.id)::int AS job_count
    FROM companies c
    JOIN jobs j ON j.company_id = c.id
    WHERE j.status = 'open' AND c.industry IS NOT NULL
    GROUP BY c.industry
    ORDER BY job_count DESC
    LIMIT 8
  `;
  const result = await pool.query(query);
  return result.rows;
}

export const statsRepository = {
  getHomepageStats,
  getJobCategories,
};
