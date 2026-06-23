import { pool } from "../db/pool";

export async function getUserById(id: string) {
  const result = await pool.query(`SELECT * FROM "user" WHERE id = $1`, [id]);
  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await pool.query(`SELECT * FROM "user" WHERE email = $1`, [email]);
  return result.rows[0];
}

export async function updateUserRole(id: string, role: string) {
  const result = await pool.query(
    `UPDATE "user" SET role = $1, "updatedAt" = now() WHERE id = $2 RETURNING *`,
    [role, id]
  );
  return result.rows[0];
}
