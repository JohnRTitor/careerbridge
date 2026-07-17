import { pool } from "../../app/db";
import type { CreateJobInput, UpdateJobInput, DeleteJobInput, GetJobApplicantsInput, UpdateApplicationStatusInput, GetAnalyticsInput, GetRecruiterProfileInput, UpsertRecruiterProfileInput } from "./recruiters.schemas";

export async function createJob(input: CreateJobInput) {
  const { recruiterId, data } = input;
  const query = `
    INSERT INTO jobs (title, description, recruiter_id, company_id, location, type, salary_range, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    data.title,
    data.description,
    recruiterId,
    data.company_id,
    data.location,
    data.type,
    data.salary_range,
    data.status,
  ]);
  return result.rows[0];
}

export async function updateJob(input: UpdateJobInput) {
  const { jobId, recruiterId, data } = input;
  const query = `
    UPDATE jobs SET
      title = COALESCE($3, title),
      description = COALESCE($4, description),
      company_id = COALESCE($5, company_id),
      location = COALESCE($6, location),
      type = COALESCE($7, type),
      salary_range = COALESCE($8, salary_range),
      status = COALESCE($9, status),
      updated_at = now()
    WHERE id = $1 AND recruiter_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [
    jobId,
    recruiterId,
    data.title,
    data.description,
    data.company_id,
    data.location,
    data.type,
    data.salary_range,
    data.status,
  ]);
  return result.rows[0];
}

export async function deleteJob(input: DeleteJobInput) {
  const { jobId, recruiterId } = input;
  const query = `DELETE FROM jobs WHERE id = $1 AND recruiter_id = $2 RETURNING id;`;
  const result = await pool.query(query, [jobId, recruiterId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export async function getJobApplicants(input: GetJobApplicantsInput) {
  const { jobId, recruiterId } = input;
  // Verify recruiter owns job
  const jobCheck = await pool.query(`SELECT id FROM jobs WHERE id = $1 AND recruiter_id = $2`, [jobId, recruiterId]);
  if (jobCheck.rowCount === 0) return null;

  const query = `
    SELECT a.*, u.name, u.email, u.image, p.headline
    FROM applications a
    JOIN "user" u ON a.candidate_id = u.id
    LEFT JOIN user_profile p ON a.candidate_id = p.user_id
    WHERE a.job_id = $1
    ORDER BY a.applied_at DESC
  `;
  const result = await pool.query(query, [jobId]);
  return result.rows;
}

export async function updateApplicationStatus(input: UpdateApplicationStatusInput) {
  const { applicationId, recruiterId, data } = input;
  const { status } = data;
  // Verify recruiter owns the job associated with application
  const jobCheck = await pool.query(`
    SELECT j.id FROM jobs j
    JOIN applications a ON a.job_id = j.id
    WHERE a.id = $1 AND j.recruiter_id = $2
  `, [applicationId, recruiterId]);
  
  if (jobCheck.rowCount === 0) return null;

  const query = `
    UPDATE applications
    SET status = $2, updated_at = now()
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [applicationId, status]);
  return result.rows[0];
}

export async function getAnalytics(input: GetAnalyticsInput) {
  const { recruiterId } = input;
  const jobsQuery = `SELECT COUNT(*) as total_jobs FROM jobs WHERE recruiter_id = $1`;
  const appsQuery = `
    SELECT a.status, COUNT(*) as count 
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE j.recruiter_id = $1
    GROUP BY a.status
  `;
  
  const [jobsRes, appsRes] = await Promise.all([
    pool.query(jobsQuery, [recruiterId]),
    pool.query(appsQuery, [recruiterId])
  ]);

  return {
    total_jobs: parseInt(jobsRes.rows[0].total_jobs, 10),
    applications_by_status: appsRes.rows,
  };
}

export async function getRecruiterProfile(input: GetRecruiterProfileInput) {
  const { userId } = input;
  const query = `
    SELECT rp.*, c.name as company_name 
    FROM recruiter_profiles rp
    LEFT JOIN companies c ON rp.company_id = c.id
    WHERE rp.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

export async function upsertRecruiterProfile(input: UpsertRecruiterProfileInput) {
  const { userId, data } = input;
  const query = `
    INSERT INTO recruiter_profiles (user_id, company_id, designation, phone, verified)
    VALUES ($1, $2, $3, $4, false)
    ON CONFLICT (user_id) DO UPDATE SET
      company_id = COALESCE(EXCLUDED.company_id, recruiter_profiles.company_id),
      designation = COALESCE(EXCLUDED.designation, recruiter_profiles.designation),
      phone = COALESCE(EXCLUDED.phone, recruiter_profiles.phone)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.company_id, data.designation, data.phone]);
  return result.rows[0];
}

export const recruitersRepository = {
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  updateApplicationStatus,
  getAnalytics,
  getRecruiterProfile,
  upsertRecruiterProfile,
};
