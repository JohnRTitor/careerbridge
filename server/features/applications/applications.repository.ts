import { pool } from "../../app/db";
import type { GetUserApplicationsInput, ApplyForJobInput, GetApplicationInput, WithdrawApplicationInput } from "./applications.schemas";

export async function getUserApplications(input: GetUserApplicationsInput) {
  const { userId } = input;
  const query = `
    SELECT a.*, j.title as job_title, c.name as company_name, c.logo_url as company_logo
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    WHERE a.candidate_id = $1
    ORDER BY a.applied_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function applyForJob(input: ApplyForJobInput) {
  const { jobId, candidateId, data } = input;
  const query = `
    INSERT INTO applications (job_id, candidate_id, resume_id, cover_letter)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [jobId, candidateId, data.resume_id, data.cover_letter]);
  return result.rows[0];
}

export async function getApplication(input: GetApplicationInput) {
  const { jobId, candidateId } = input;
  const query = `
    SELECT * FROM applications
    WHERE job_id = $1 AND candidate_id = $2
  `;
  const result = await pool.query(query, [jobId, candidateId]);
  return result.rows[0];
}

export async function withdrawApplication(input: WithdrawApplicationInput) {
  const { applicationId, candidateId } = input;
  const query = `
    DELETE FROM applications 
    WHERE id = $1 AND candidate_id = $2 
    RETURNING id;
  `;
  const result = await pool.query(query, [applicationId, candidateId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export const applicationsRepository = {
  getUserApplications,
  applyForJob,
  getApplication,
  withdrawApplication,
};
