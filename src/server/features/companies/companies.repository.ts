import { pool } from "../../app/db";
import type { ListCompaniesInput, GetCompanyInput, VerifyCompanyInput } from "./companies.schemas";

export async function listCompanies(input: ListCompaniesInput & { offset: number }) {
  const { limit = 10, offset, query: queryStr } = input;
  let baseQuery = `SELECT * FROM companies`;
  const values: any[] = [];
  let paramIndex = 1;

  if (queryStr) {
    baseQuery += ` WHERE name ILIKE $${paramIndex} OR description ILIKE $${paramIndex}`;
    values.push(`%${queryStr}%`);
    paramIndex++;
  }

  const countQuery = `SELECT COUNT(*) FROM (${baseQuery}) AS c`;
  const countRes = await pool.query(countQuery, values);
  const total = parseInt(countRes.rows[0].count, 10);

  baseQuery += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  values.push(limit, offset);

  const result = await pool.query(baseQuery, values);
  return { data: result.rows, total };
}

export async function getCompany(input: GetCompanyInput) {
  const { companyId } = input;
  const query = `SELECT * FROM companies WHERE id = $1`;
  const result = await pool.query(query, [companyId]);
  return result.rows[0];
}

export async function verifyCompany(input: VerifyCompanyInput) {
  const { companyId, isVerified } = input;
  const query = `
    UPDATE companies
    SET is_verified = $2, updated_at = now()
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [companyId, isVerified]);
  return result.rows[0];
}

export const companiesRepository = {
  listCompanies,
  getCompany,
  verifyCompany,
};
