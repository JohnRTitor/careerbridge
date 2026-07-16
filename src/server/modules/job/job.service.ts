import { pool } from "../../db/pool";

export async function getJobs() {
  const result = await pool.query(`SELECT * FROM jobs ORDER BY title ASC`);
  return result.rows;
}

export async function getJobById(id: string) {
  const result = await pool.query(`SELECT * FROM jobs WHERE id = $1`, [id]);
  return result.rows[0];
}

export async function createJob(title: string, description: string, recruiterId: string) {
  const result = await pool.query(
    `INSERT INTO jobs (title, description, recruiter_id) VALUES ($1, $2, $3) RETURNING *`,
    [title, description, recruiterId]
  );
  return result.rows[0];
}

export async function updateJob(id: string, title: string, description: string, recruiterId: string | null = null) {
  let result;
  if (recruiterId) {
    result = await pool.query(
      `UPDATE jobs SET title = $1, description = $2 WHERE id = $3 AND recruiter_id = $4 RETURNING *`,
      [title, description, id, recruiterId]
    );
  } else {
    result = await pool.query(
      `UPDATE jobs SET title = $1, description = $2 WHERE id = $3 RETURNING *`,
      [title, description, id]
    );
  }
  return result.rows[0];
}

export async function deleteJob(id: string, recruiterId: string | null = null) {
  let result;
  if (recruiterId) {
    result = await pool.query(
      `DELETE FROM jobs WHERE id = $1 AND recruiter_id = $2 RETURNING *`,
      [id, recruiterId]
    );
  } else {
    result = await pool.query(`DELETE FROM jobs WHERE id = $1 RETURNING *`, [id]);
  }
  return result.rows[0];
}
