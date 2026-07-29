import { z } from "zod";

export const BUCKET_CONFIGS: Record<string, { public: boolean; maxBytes: number; mimeTypes: string[] }> = {
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

export const UploadRequestSchema = z.object({
  bucket: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  featureId: z.string().optional(),
});

export const CompleteUploadSchema = z.object({
  bucket: z.string(),
  path: z.string(),
  originalFilename: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
});

export type UploadRequestInput = z.infer<typeof UploadRequestSchema>;
export type CompleteUploadInput = z.infer<typeof CompleteUploadSchema>;
