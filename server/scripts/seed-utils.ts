import { pool } from "../app/db";

// --- Enums & Helpers ---
export const JOB_TYPES = ["full-time", "part-time", "contract", "internship", "freelance"];
export const JOB_STATUSES = ["open", "closed", "draft"];
export const APP_STATUSES = ["pending", "reviewing", "shortlisted", "rejected", "hired"];
export const WORK_MODES = ["remote", "hybrid", "onsite"];
export const VISIBILITIES = ["public", "private"];

export function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

export async function batchInsert(
  tableName: string,
  columns: string[],
  data: unknown[][],
  onConflict: string = "",
  chunkSize = 2000
) {
  if (data.length === 0) return;
  const colNames = columns.map((c) => `"${c}"`).join(", ");
  const paramsPerRow = columns.length;
  const maxRowsPerChunk = Math.floor(65000 / paramsPerRow);
  const actualChunkSize = Math.min(chunkSize, maxRowsPerChunk);

  for (let i = 0; i < data.length; i += actualChunkSize) {
    const chunk = data.slice(i, i + actualChunkSize);
    const values: unknown[] = [];
    const queryPlaceholders = [];

    let paramIndex = 1;
    for (const row of chunk) {
      const rowPlaceholders = [];
      for (const val of row) {
        values.push(val);
        rowPlaceholders.push(`$${paramIndex++}`);
      }
      queryPlaceholders.push(`(${rowPlaceholders.join(", ")})`);
    }

    let query = `INSERT INTO "${tableName}" (${colNames}) VALUES ${queryPlaceholders.join(", ")}`;
    if (onConflict) {
      query += ` ON CONFLICT ${onConflict}`;
    }
    
    try {
      await pool.query(query, values);
    } catch (e) {
      console.error(`Error inserting into ${tableName}:`, e);
      throw e;
    }
  }
}
