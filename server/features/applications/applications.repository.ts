import { pool } from "../../app/db";
import type { GetUserApplicationsInput, ApplyForJobInput, GetApplicationInput, WithdrawApplicationInput } from "./applications.schemas";

export async function getUserApplications(input: GetUserApplicationsInput) {
  const { userId } = input;
  const query = `
    SELECT a.*, j.title as job_title, c.name as company_name, c.logo_url as company_logo,
           fl.path as company_logo_file_path, fl.bucket as company_logo_file_bucket
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN files fl ON c.logo_file_id = fl.id
    WHERE a.candidate_id = $1
    ORDER BY a.applied_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function applyForJob(input: ApplyForJobInput) {
  const { jobId, candidateId, data } = input;
  const status = data.is_draft ? 'draft' : 'pending';
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO applications (job_id, candidate_id, form_id, resume_id, cover_letter, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const result = await client.query(query, [
      jobId, 
      candidateId, 
      data.form_id, 
      data.resume_id, 
      data.cover_letter,
      status
    ]);
    const application = result.rows[0];

    if (data.answers && Object.keys(data.answers).length > 0) {
      for (const [questionId, answerValue] of Object.entries(data.answers)) {
        await client.query(`
          INSERT INTO application_answers (application_id, question_id, answer_value)
          VALUES ($1, $2, $3)
        `, [application.id, questionId, JSON.stringify(answerValue)]);
      }
    }

    await client.query('COMMIT');
    return application;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function updateApplication(applicationId: string, data: ApplyForJobInput["data"]) {
  const status = data.is_draft ? 'draft' : 'pending';
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const query = `
      UPDATE applications 
      SET form_id = $1, resume_id = $2, cover_letter = $3, status = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    const result = await client.query(query, [
      data.form_id, 
      data.resume_id, 
      data.cover_letter,
      status,
      applicationId
    ]);
    const application = result.rows[0];

    if (data.answers) {
      // Delete existing answers and re-insert
      await client.query(`DELETE FROM application_answers WHERE application_id = $1`, [applicationId]);
      
      if (Object.keys(data.answers).length > 0) {
        for (const [questionId, answerValue] of Object.entries(data.answers)) {
          await client.query(`
            INSERT INTO application_answers (application_id, question_id, answer_value)
            VALUES ($1, $2, $3)
          `, [applicationId, questionId, JSON.stringify(answerValue)]);
        }
      }
    }

    await client.query('COMMIT');
    return application;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
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

export async function hasCandidateAppliedToRecruiter(candidateId: string, recruiterId: string) {
  const query = `
    SELECT 1 FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.candidate_id = $1 AND j.created_by = $2
    LIMIT 1
  `;
  const result = await pool.query(query, [candidateId, recruiterId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export const applicationsRepository = {
  getUserApplications,
  applyForJob,
  getApplication,
  updateApplication,
  withdrawApplication,
  hasCandidateAppliedToRecruiter,
};
