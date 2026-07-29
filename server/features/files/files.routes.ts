import { Hono } from "hono";
import { AppEnv } from "../../shared/types";
import { sValidator } from "@hono/standard-validator";
import { describeRoute } from "hono-openapi";
import { requireAuth } from "../../app/middleware/auth";
import { z } from "zod";
import { ok, created, fail } from "../../shared/responses";
import { AppError } from "../../shared/errors";
import { pool } from "../../app/db";
import { generateUploadUrl } from "../../shared/storage";

const app = new Hono<AppEnv>();

const BUCKET_CONFIGS: Record<string, { public: boolean; maxBytes: number; mimeTypes: string[] }> = {
  avatars: {
    public: true,
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  },
  "company-assets": {
    public: true,
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"],
  },
  "job-assets": {
    public: true,
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  },
  resumes: {
    public: false,
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: ["application/pdf"],
  },
  documents: {
    public: false,
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.oasis.opendocument.text",
      "application/rtf",
      "text/plain",
    ],
  },
};

const UploadRequestSchema = z.object({
  bucket: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  featureId: z.string().optional(), // e.g. companyId or jobId if needed for path
});

const CompleteUploadSchema = z.object({
  bucket: z.string(),
  path: z.string(),
  originalFilename: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
});

export const filesRoutes = app
  .use("*", requireAuth)
  .post(
    "/upload-url",
    describeRoute({
      description: "Request a signed URL to upload a file to Supabase directly",
      responses: {
        200: { description: "Signed URL generated" },
      },
    }),
    sValidator("json", UploadRequestSchema),
    async (c) => {
      const user = c.get("user");
      const { bucket, filename, mimeType, size, featureId } = c.req.valid("json");

      const config = BUCKET_CONFIGS[bucket];
      if (!config) {
        throw new AppError(400, `Invalid bucket: ${bucket}`, "INVALID_BUCKET");
      }

      if (size > config.maxBytes) {
        throw new AppError(400, `File exceeds maximum size of ${config.maxBytes} bytes`, "FILE_TOO_LARGE");
      }

      if (!config.mimeTypes.includes(mimeType)) {
        throw new AppError(400, `MIME type ${mimeType} is not allowed for bucket ${bucket}`, "INVALID_MIME_TYPE");
      }

      const uuid = crypto.randomUUID();
      const ext = filename.split(".").pop()?.toLowerCase() || "bin";
      
      let pathPrefix = user.id;
      if (bucket === "company-assets" && featureId) {
        pathPrefix = featureId; // We should ideally verify user belongs to company
      } else if (bucket === "job-assets" && featureId) {
        pathPrefix = featureId;
      } else if (bucket === "resumes" && featureId) {
        pathPrefix = featureId;
      }
      
      const path = `${pathPrefix}/${uuid}.${ext}`;

      const { signedUrl, token } = await generateUploadUrl(bucket, path);

      return ok(c, {
        signedUrl,
        path,
        token,
        bucket,
      });
    }
  )
  .post(
    "/complete",
    describeRoute({
      description: "Mark an upload as complete and persist to database",
      responses: {
        201: { description: "File metadata saved" },
      },
    }),
    sValidator("json", CompleteUploadSchema),
    async (c) => {
      const user = c.get("user");
      const { bucket, path, originalFilename, mimeType, size } = c.req.valid("json");

      // Ideally we would verify the file actually exists in Supabase here or rely on the client for now.
      
      const result = await pool.query(
        `INSERT INTO files (bucket, path, original_filename, mime_type, size, owner_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, bucket, path`,
        [bucket, path, originalFilename, mimeType, size, user.id]
      );

      return created(c, result.rows[0]);
    }
  );
