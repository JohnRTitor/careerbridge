import { pool } from "../../app/db";
import type { 
  GetProfileInput, 
  UpdateProfileInput, 
  UpdateResumeInput, 
  AddEducationInput, 
  UpdateEducationInput, 
  DeleteEducationInput, 
  AddExperienceInput, 
  UpdateExperienceInput, 
  DeleteExperienceInput 
} from "./profiles.schemas";

export async function getProfile(input: GetProfileInput) {
  const { userId } = input;
  const query = `
    SELECT p.*, u.name, u.email, u.image 
    FROM user_profile p
    JOIN "user" u ON p.user_id = u.id
    WHERE p.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

export async function upsertProfile(input: UpdateProfileInput) {
  const { userId, data } = input;
  const query = `
    INSERT INTO user_profile (user_id, headline, about, visibility, portfolio_url, updated_at)
    VALUES ($1, $2, $3, $4, $5, now())
    ON CONFLICT (user_id) DO UPDATE SET
      headline = COALESCE(EXCLUDED.headline, user_profile.headline),
      about = COALESCE(EXCLUDED.about, user_profile.about),
      visibility = COALESCE(EXCLUDED.visibility, user_profile.visibility),
      portfolio_url = COALESCE(EXCLUDED.portfolio_url, user_profile.portfolio_url),
      updated_at = now()
    RETURNING *;
  `;
  const result = await pool.query(query, [
    userId,
    data.headline,
    data.about,
    data.visibility,
    data.portfolio_url,
  ]);
  return result.rows[0];
}

export async function updateResume(input: UpdateResumeInput) {
  const { userId, data } = input;
  const query = `
    UPDATE user_profile 
    SET resume_url = $2, updated_at = now() 
    WHERE user_id = $1 
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.resume_url]);
  return result.rows[0];
}

export async function getEducation(input: GetProfileInput) {
  const { userId } = input;
  const query = `SELECT * FROM education WHERE user_id = $1 ORDER BY start_date DESC`;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addEducation(input: AddEducationInput) {
  const { userId, data } = input;
  const query = `
    INSERT INTO education (user_id, institution, degree, field_of_study, start_date, end_date, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    userId,
    data.institution,
    data.degree,
    data.field_of_study,
    data.start_date,
    data.end_date,
    data.description,
  ]);
  return result.rows[0];
}

export async function updateEducation(input: UpdateEducationInput) {
  const { educationId, userId, data } = input;
  const query = `
    UPDATE education SET
      institution = COALESCE($3, institution),
      degree = COALESCE($4, degree),
      field_of_study = COALESCE($5, field_of_study),
      start_date = COALESCE($6, start_date),
      end_date = COALESCE($7, end_date),
      description = COALESCE($8, description),
      updated_at = now()
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [
    educationId,
    userId,
    data.institution,
    data.degree,
    data.field_of_study,
    data.start_date,
    data.end_date,
    data.description,
  ]);
  return result.rows[0];
}

export async function deleteEducation(input: DeleteEducationInput) {
  const { educationId, userId } = input;
  const query = `DELETE FROM education WHERE id = $1 AND user_id = $2 RETURNING id;`;
  const result = await pool.query(query, [educationId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export async function getExperience(input: GetProfileInput) {
  const { userId } = input;
  const query = `SELECT * FROM experience WHERE user_id = $1 ORDER BY start_date DESC`;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addExperience(input: AddExperienceInput) {
  const { userId, data } = input;
  const query = `
    INSERT INTO experience (user_id, title, company, location, start_date, end_date, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const result = await pool.query(query, [
    userId,
    data.title,
    data.company,
    data.location,
    data.start_date,
    data.end_date,
    data.description,
  ]);
  return result.rows[0];
}

export async function updateExperience(input: UpdateExperienceInput) {
  const { experienceId, userId, data } = input;
  const query = `
    UPDATE experience SET
      title = COALESCE($3, title),
      company = COALESCE($4, company),
      location = COALESCE($5, location),
      start_date = COALESCE($6, start_date),
      end_date = COALESCE($7, end_date),
      description = COALESCE($8, description),
      updated_at = now()
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [
    experienceId,
    userId,
    data.title,
    data.company,
    data.location,
    data.start_date,
    data.end_date,
    data.description,
  ]);
  return result.rows[0];
}

export async function deleteExperience(input: DeleteExperienceInput) {
  const { experienceId, userId } = input;
  const query = `DELETE FROM experience WHERE id = $1 AND user_id = $2 RETURNING id;`;
  const result = await pool.query(query, [experienceId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export const profilesRepository = {
  getProfile,
  upsertProfile,
  updateResume,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getExperience,
  addExperience,
  updateExperience,
  deleteExperience,
};
