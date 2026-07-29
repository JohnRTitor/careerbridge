import { pool } from "../../app/db";
import type { 
  ListCompaniesInput, 
  GetCompanyInput, 
  VerifyCompanyInput,
  CreateCompanyInput,
  UpdateCompanyInput,
  DeleteCompanyInput,
  FollowCompanyInput,
  UnfollowCompanyInput,
  GetFollowedCompaniesInput,
  AddCompanyMemberInput,
  UpdateCompanyMemberInput,
  RemoveCompanyMemberInput,
  GetCompanyMembersInput
} from "./companies.schemas";

export async function listCompanies(input: ListCompaniesInput & { offset: number }) {
  const { limit = 10, offset, query: queryStr } = input;
  let baseQuery = `
    SELECT c.*, 
      (SELECT COUNT(*) FROM jobs j WHERE j.company_id = c.id AND j.status = 'open') AS open_jobs_count
    FROM companies c
  `;
  const values: unknown[] = [];
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
  const query = `
    SELECT c.*,
           f.path as logo_file_path,
           f.bucket as logo_file_bucket
    FROM companies c
    LEFT JOIN files f ON c.logo_file_id = f.id
    WHERE c.id = $1
  `;
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

export async function createCompany(input: CreateCompanyInput) {
  const { data } = input;
  const query = `
    INSERT INTO companies (name, description, logo_url, logo_file_id, website, industry, size, location)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const result = await pool.query(query, [data.name, data.description, data.logo_url, data.logo_file_id, data.website, data.industry, data.size, data.location]);
  return result.rows[0];
}

export async function updateCompany(input: UpdateCompanyInput) {
  const { companyId, data } = input;
  const query = `
    UPDATE companies SET
      name = COALESCE($2, name),
      description = COALESCE($3, description),
      logo_url = COALESCE($4, logo_url),
      logo_file_id = COALESCE($5, logo_file_id),
      website = COALESCE($6, website),
      industry = COALESCE($7, industry),
      size = COALESCE($8, size),
      location = COALESCE($9, location),
      updated_at = now()
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [companyId, data.name, data.description, data.logo_url, data.logo_file_id, data.website, data.industry, data.size, data.location]);
  return result.rows[0];
}

export async function deleteCompany(input: DeleteCompanyInput) {
  const { companyId } = input;
  const query = `DELETE FROM companies WHERE id = $1 RETURNING id;`;
  const result = await pool.query(query, [companyId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

// Followers
export async function followCompany(input: FollowCompanyInput) {
  const { companyId, userId } = input;
  const query = `
    INSERT INTO company_followers (company_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [companyId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export async function unfollowCompany(input: UnfollowCompanyInput) {
  const { companyId, userId } = input;
  const query = `
    DELETE FROM company_followers
    WHERE company_id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [companyId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export async function getFollowedCompanies(input: GetFollowedCompaniesInput) {
  const { userId } = input;
  const query = `
    SELECT c.*,
      fl.path as logo_file_path,
      fl.bucket as logo_file_bucket,
      COALESCE(
        json_agg(json_build_object('id', u.id, 'name', u.name, 'image', u.image, 'role', cm.role))
        FILTER (WHERE u.id IS NOT NULL),
        '[]'
      ) as members
    FROM companies c
    JOIN company_followers cf ON c.id = cf.company_id
    LEFT JOIN files fl ON c.logo_file_id = fl.id
    LEFT JOIN company_members cm ON c.id = cm.company_id
    LEFT JOIN "user" u ON cm.user_id = u.id
    WHERE cf.user_id = $1
    GROUP BY c.id, cf.company_id, cf.user_id, cf.followed_at, fl.path, fl.bucket
    ORDER BY cf.followed_at DESC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Members
export async function addCompanyMember(input: AddCompanyMemberInput) {
  const { companyId, data } = input;
  const query = `
    INSERT INTO company_members (company_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [companyId, data.user_id, data.role]);
  return result.rows[0];
}

export async function updateCompanyMember(input: UpdateCompanyMemberInput) {
  const { companyId, userId, data } = input;
  const query = `
    UPDATE company_members SET role = COALESCE($3, role)
    WHERE company_id = $1 AND user_id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [companyId, userId, data.role]);
  return result.rows[0];
}

export async function removeCompanyMember(input: RemoveCompanyMemberInput) {
  const { companyId, userId } = input;
  const query = `DELETE FROM company_members WHERE company_id = $1 AND user_id = $2 RETURNING *;`;
  const result = await pool.query(query, [companyId, userId]);
  return result.rowCount ? result.rowCount > 0 : false;
}

export async function getCompanyMembers(input: GetCompanyMembersInput) {
  const { companyId } = input;
  const query = `
    SELECT cm.role, u.id, u.name, u.email, u.image 
    FROM company_members cm
    JOIN "user" u ON cm.user_id = u.id
    WHERE cm.company_id = $1
  `;
  const result = await pool.query(query, [companyId]);
  return result.rows;
}

export const companiesRepository = {
  listCompanies,
  getCompany,
  verifyCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
  addCompanyMember,
  updateCompanyMember,
  removeCompanyMember,
  getCompanyMembers,
};
