import { pool } from "../../db/pool";

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

export async function updateUser(id: string, data: { name?: string; image?: string }) {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (data.name !== undefined) {
    setClauses.push(`name = $${index++}`);
    values.push(data.name);
  }
  if (data.image !== undefined) {
    setClauses.push(`image = $${index++}`);
    values.push(data.image);
  }

  if (setClauses.length === 0) {
    return getUserById(id);
  }

  setClauses.push(`"updatedAt" = now()`);
  
  const query = `
    UPDATE "user"
    SET ${setClauses.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
}
