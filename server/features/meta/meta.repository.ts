import { pool } from "../../app/db";
import type { SearchMetaInput, CreateSkillInput, CreateLanguageInput } from "./meta.schemas";

export async function searchSkills(input: SearchMetaInput) {
  const { query, limit } = input;
  let baseQuery = `SELECT * FROM skills`;
  const values: unknown[] = [];
  
  if (query) {
    baseQuery += ` WHERE name ILIKE $1`;
    values.push(`%${query}%`);
  }
  
  baseQuery += ` ORDER BY name ASC LIMIT $${values.length + 1}`;
  values.push(limit);
  
  const result = await pool.query(baseQuery, values);
  return result.rows;
}

export async function createSkill(input: CreateSkillInput) {
  const { name } = input;
  const query = `
    WITH e AS (
      INSERT INTO skills (name) 
      VALUES ($1) 
      ON CONFLICT (LOWER(name)) DO NOTHING 
      RETURNING *
    )
    SELECT * FROM e
    UNION ALL
    SELECT * FROM skills WHERE LOWER(name) = LOWER($1)
    LIMIT 1;
  `;
  const result = await pool.query(query, [name]);
  return result.rows[0];
}

export async function searchLanguages(input: SearchMetaInput) {
  const { query, limit } = input;
  let baseQuery = `SELECT * FROM languages`;
  const values: unknown[] = [];
  
  if (query) {
    baseQuery += ` WHERE name ILIKE $1`;
    values.push(`%${query}%`);
  }
  
  baseQuery += ` ORDER BY name ASC LIMIT $${values.length + 1}`;
  values.push(limit);
  
  const result = await pool.query(baseQuery, values);
  return result.rows;
}

export async function createLanguage(input: CreateLanguageInput) {
  const { name } = input;
  const query = `
    INSERT INTO languages (name) 
    VALUES ($1) 
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
    RETURNING *;
  `;
  const result = await pool.query(query, [name]);
  return result.rows[0];
}

export async function getCurrencies() {
  const query = `SELECT unnest(enum_range(NULL::currency_code))::text AS currency;`;
  const result = await pool.query(query);
  return result.rows.map(r => r.currency);
}

export const metaRepository = {
  searchSkills,
  createSkill,
  searchLanguages,
  createLanguage,
  getCurrencies,
};
