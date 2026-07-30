import { pool } from "../../app/db";
import type { SearchJobsInput, GetJobByIdInput, SaveJobInput, UnsaveJobInput, GetRecommendationsInput, GetSavedJobsInput } from "./jobs.schemas";

export async function searchJobs(input: SearchJobsInput & { limit: number; offset: number }) {
  const { query: queryStr, location, type, is_featured, status = 'open', limit, offset } = input;
  let baseQuery = `
    SELECT j.*, c.name as company_name, c.logo_url as company_logo,
           fl.path as company_logo_file_path, fl.bucket as company_logo_file_bucket
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN files fl ON c.logo_file_id = fl.id
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
    SELECT j.*, c.name as company_name, c.logo_url as company_logo, c.description as company_description,
           fl.path as company_logo_file_path, fl.bucket as company_logo_file_bucket
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN files fl ON c.logo_file_id = fl.id
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
    SELECT j.*, c.name as company_name, c.logo_url as company_logo,
           fl.path as company_logo_file_path, fl.bucket as company_logo_file_bucket
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN files fl ON c.logo_file_id = fl.id
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
    SELECT j.*, c.name as company_name, c.logo_url as company_logo, sj.saved_at,
           fl.path as company_logo_file_path, fl.bucket as company_logo_file_bucket
    FROM saved_jobs sj
    JOIN jobs j ON sj.job_id = j.id
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN files fl ON c.logo_file_id = fl.id
    WHERE sj.user_id = $1
    ORDER BY sj.saved_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function getApplicationForm(jobId: string) {
  const formQuery = `SELECT * FROM job_application_forms WHERE job_id = $1 AND is_active = true`;
  const formResult = await pool.query(formQuery, [jobId]);
  if (formResult.rowCount === 0) return null;
  
  const form = formResult.rows[0];
  const questionsQuery = `SELECT * FROM job_application_questions WHERE form_id = $1 ORDER BY "order" ASC`;
  const questionsResult = await pool.query(questionsQuery, [form.id]);
  
  return {
    ...form,
    questions: questionsResult.rows
  };
}

export async function updateApplicationForm(jobId: string, data: any) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const currentFormResult = await client.query(`SELECT version FROM job_application_forms WHERE job_id = $1 AND is_active = true`, [jobId]);
    const nextVersion = (currentFormResult.rowCount ?? 0) > 0 ? parseInt(currentFormResult.rows[0].version) + 1 : 1;
    
    await client.query(`UPDATE job_application_forms SET is_active = false WHERE job_id = $1`, [jobId]);
    
    const formInsert = `
      INSERT INTO job_application_forms (job_id, version, method, resume_required, cover_letter_required, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *
    `;
    const newFormResult = await client.query(formInsert, [jobId, nextVersion, data.method, data.resume_required, data.cover_letter_required]);
    const newForm = newFormResult.rows[0];
    
    const questions = [];
    if (data.questions && data.questions.length > 0) {
      for (const q of data.questions) {
        const qInsert = `
          INSERT INTO job_application_questions (form_id, type, section, label, description, is_required, options, "order")
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `;
        const optionsJson = q.options ? JSON.stringify(q.options) : null;
        const qResult = await client.query(qInsert, [newForm.id, q.type, q.section, q.label, q.description, q.is_required, optionsJson, q.order]);
        questions.push(qResult.rows[0]);
      }
    }
    
    await client.query('COMMIT');
    return { ...newForm, questions };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export const jobsRepository = {
  searchJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getRecommendations,
  getSavedJobs,
  getApplicationForm,
  updateApplicationForm,
};
