import { pool } from "../../app/db";

export const filesRepository = {
  async saveFileMetadata(data: {
    bucket: string;
    path: string;
    originalFilename: string;
    mimeType: string;
    size: number;
    ownerId: string;
  }) {
    const { bucket, path, originalFilename, mimeType, size, ownerId } = data;
    const result = await pool.query(
      `INSERT INTO files (bucket, path, original_filename, mime_type, size, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, bucket, path`,
      [bucket, path, originalFilename, mimeType, size, ownerId]
    );
    return result.rows[0];
  }
};
