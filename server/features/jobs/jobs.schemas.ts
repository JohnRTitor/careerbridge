import { z } from "zod";
import { PaginationQuerySchema } from "../../shared/schemas";

export const JobTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
]);
export type JobType = z.infer<typeof JobTypeSchema>;
export const JobStatusSchema = z.enum(["open", "closed", "draft"]);
export type JobStatus = z.infer<typeof JobStatusSchema>;

export const JobSearchQuerySchema = PaginationQuerySchema.extend({
  query: z.string().optional(),
  location: z.string().optional(),
  type: JobTypeSchema.optional(),
  companyId: z.string().optional(),
  is_featured: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .optional(),
  status: JobStatusSchema.optional(),
}).meta({ id: "JobSearchQuery" });
export type JobSearchQuery = z.infer<typeof JobSearchQuerySchema>;

// Input Types
export type SearchJobsInput = JobSearchQuery;

export type GetJobByIdInput = {
  jobId: string;
};

export type SaveJobInput = {
  userId: string;
  jobId: string;
};

export type UnsaveJobInput = {
  userId: string;
  jobId: string;
};

export type GetRecommendationsInput = {
  userId: string;
};

export type GetSavedJobsInput = {
  userId: string;
};
