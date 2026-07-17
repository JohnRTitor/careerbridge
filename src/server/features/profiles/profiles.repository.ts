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

export async function getCertifications(input: GetProfileInput) {
  const { userId } = input;
  const query = `SELECT * FROM certifications WHERE user_id = $1 ORDER BY issue_date DESC NULLS LAST`;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addCertification(input: any) {
  const { userId, data } = input;
  const query = `
    INSERT INTO certifications (user_id, name, issuer, issue_date, expiry_date, credential_id, credential_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.name, data.issuer, data.issue_date, data.expiry_date, data.credential_id, data.credential_url]);
  return result.rows[0];
}

export async function updateCertification(input: any) {
  const { certificationId, userId, data } = input;
  const query = `
    UPDATE certifications SET
      name = COALESCE($3, name),
      issuer = COALESCE($4, issuer),
      issue_date = COALESCE($5, issue_date),
      expiry_date = COALESCE($6, expiry_date),
      credential_id = COALESCE($7, credential_id),
      credential_url = COALESCE($8, credential_url)
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [certificationId, userId, data.name, data.issuer, data.issue_date, data.expiry_date, data.credential_id, data.credential_url]);
  return result.rows[0];
}

export async function deleteCertification(input: any) {
  const { certificationId, userId } = input;
  const query = `DELETE FROM certifications WHERE id = $1 AND user_id = $2 RETURNING id;`;
  const result = await pool.query(query, [certificationId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

// Projects
export async function getProjects(input: GetProfileInput) {
  const { userId } = input;
  const query = `SELECT * FROM projects WHERE user_id = $1 ORDER BY start_date DESC NULLS LAST`;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addProject(input: any) {
  const { userId, data } = input;
  const query = `
    INSERT INTO projects (user_id, title, description, repository_url, live_url, start_date, end_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.title, data.description, data.repository_url, data.live_url, data.start_date, data.end_date]);
  return result.rows[0];
}

export async function updateProject(input: any) {
  const { projectId, userId, data } = input;
  const query = `
    UPDATE projects SET
      title = COALESCE($3, title),
      description = COALESCE($4, description),
      repository_url = COALESCE($5, repository_url),
      live_url = COALESCE($6, live_url),
      start_date = COALESCE($7, start_date),
      end_date = COALESCE($8, end_date)
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [projectId, userId, data.title, data.description, data.repository_url, data.live_url, data.start_date, data.end_date]);
  return result.rows[0];
}

export async function deleteProject(input: any) {
  const { projectId, userId } = input;
  const query = `DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id;`;
  const result = await pool.query(query, [projectId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

// Resumes
export async function getResumes(input: GetProfileInput) {
  const { userId } = input;
  const query = `SELECT * FROM resumes WHERE user_id = $1 ORDER BY uploaded_at DESC`;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addResume(input: any) {
  const { userId, data } = input;
  const query = `
    INSERT INTO resumes (user_id, title, file_url, is_default)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.title, data.file_url, data.is_default]);
  return result.rows[0];
}

export async function updateResumeEntity(input: any) {
  const { resumeId, userId, data } = input;
  const query = `
    UPDATE resumes SET
      title = COALESCE($3, title),
      is_default = COALESCE($4, is_default)
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [resumeId, userId, data.title, data.is_default]);
  return result.rows[0];
}

export async function deleteResume(input: any) {
  const { resumeId, userId } = input;
  const query = `DELETE FROM resumes WHERE id = $1 AND user_id = $2 RETURNING id;`;
  const result = await pool.query(query, [resumeId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

// User Skills
export async function getUserSkills(input: GetProfileInput) {
  const { userId } = input;
  const query = `
    SELECT us.*, s.name as skill_name 
    FROM user_skills us
    JOIN skills s ON us.skill_id = s.id
    WHERE us.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addUserSkill(input: any) {
  const { userId, data } = input;
  const query = `
    INSERT INTO user_skills (user_id, skill_id, years_of_experience, proficiency)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, skill_id) DO UPDATE SET
      years_of_experience = EXCLUDED.years_of_experience,
      proficiency = EXCLUDED.proficiency
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.skill_id, data.years_of_experience, data.proficiency]);
  return result.rows[0];
}

export async function updateUserSkill(input: any) {
  const { skillId, userId, data } = input;
  const query = `
    UPDATE user_skills SET
      years_of_experience = COALESCE($3, years_of_experience),
      proficiency = COALESCE($4, proficiency)
    WHERE skill_id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [skillId, userId, data.years_of_experience, data.proficiency]);
  return result.rows[0];
}

export async function deleteUserSkill(input: any) {
  const { skillId, userId } = input;
  const query = `DELETE FROM user_skills WHERE skill_id = $1 AND user_id = $2 RETURNING skill_id;`;
  const result = await pool.query(query, [skillId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

// User Languages
export async function getUserLanguages(input: GetProfileInput) {
  const { userId } = input;
  const query = `
    SELECT ul.*, l.name as language_name 
    FROM user_languages ul
    JOIN languages l ON ul.language_id = l.id
    WHERE ul.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addUserLanguage(input: any) {
  const { userId, data } = input;
  const query = `
    INSERT INTO user_languages (user_id, language_id, proficiency)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, language_id) DO UPDATE SET
      proficiency = EXCLUDED.proficiency
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.language_id, data.proficiency]);
  return result.rows[0];
}

export async function updateUserLanguage(input: any) {
  const { languageId, userId, data } = input;
  const query = `
    UPDATE user_languages SET
      proficiency = COALESCE($3, proficiency)
    WHERE language_id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [languageId, userId, data.proficiency]);
  return result.rows[0];
}

export async function deleteUserLanguage(input: any) {
  const { languageId, userId } = input;
  const query = `DELETE FROM user_languages WHERE language_id = $1 AND user_id = $2 RETURNING language_id;`;
  const result = await pool.query(query, [languageId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

// Social Links
export async function getSocialLinks(input: GetProfileInput) {
  const { userId } = input;
  const query = `SELECT * FROM social_links WHERE user_id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function addSocialLink(input: any) {
  const { userId, data } = input;
  const query = `
    INSERT INTO social_links (user_id, platform, url)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, data.platform, data.url]);
  return result.rows[0];
}

export async function updateSocialLink(input: any) {
  const { linkId, userId, data } = input;
  const query = `
    UPDATE social_links SET
      platform = COALESCE($3, platform),
      url = COALESCE($4, url)
    WHERE id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [linkId, userId, data.platform, data.url]);
  return result.rows[0];
}

export async function deleteSocialLink(input: any) {
  const { linkId, userId } = input;
  const query = `DELETE FROM social_links WHERE id = $1 AND user_id = $2 RETURNING id;`;
  const result = await pool.query(query, [linkId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

// Job Preferences
export async function getJobPreferences(input: GetProfileInput) {
  const { userId } = input;
  const query = `SELECT * FROM job_preferences WHERE user_id = $1`;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

export async function upsertJobPreferences(input: any) {
  const { userId, data } = input;
  const query = `
    INSERT INTO job_preferences (
      user_id, preferred_job_type, preferred_work_mode, preferred_location, 
      expected_salary, notice_period, willing_to_relocate, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, now())
    ON CONFLICT (user_id) DO UPDATE SET
      preferred_job_type = COALESCE(EXCLUDED.preferred_job_type, job_preferences.preferred_job_type),
      preferred_work_mode = COALESCE(EXCLUDED.preferred_work_mode, job_preferences.preferred_work_mode),
      preferred_location = COALESCE(EXCLUDED.preferred_location, job_preferences.preferred_location),
      expected_salary = COALESCE(EXCLUDED.expected_salary, job_preferences.expected_salary),
      notice_period = COALESCE(EXCLUDED.notice_period, job_preferences.notice_period),
      willing_to_relocate = COALESCE(EXCLUDED.willing_to_relocate, job_preferences.willing_to_relocate),
      updated_at = now()
    RETURNING *;
  `;
  const result = await pool.query(query, [
    userId, data.preferred_job_type, data.preferred_work_mode, data.preferred_location,
    data.expected_salary, data.notice_period, data.willing_to_relocate
  ]);
  return result.rows[0];
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
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getResumes,
  addResume,
  updateResumeEntity,
  deleteResume,
  getUserSkills,
  addUserSkill,
  updateUserSkill,
  deleteUserSkill,
  getUserLanguages,
  addUserLanguage,
  updateUserLanguage,
  deleteUserLanguage,
  getSocialLinks,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getJobPreferences,
  upsertJobPreferences,
};
