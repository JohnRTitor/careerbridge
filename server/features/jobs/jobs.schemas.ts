import { z } from "zod";
import { PaginationQuerySchema } from "../../shared/schemas";

export const JobSchema = z.object({
  id: z.string().uuid(),
  company_id: z.string().uuid(),
  recruiter_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  requirements: z.string().nullable(),
  benefits: z.string().nullable(),
  type: z.enum(["full-time", "part-time", "contract", "internship", "freelance"]),
  location: z.string(),
  salary_min: z.number().nullable(),
  salary_max: z.number().nullable(),
  currency: z.string().nullable(),
  status: z.enum(["open", "closed", "draft"]),
  created_at: z.string(),
  updated_at: z.string(),
  company_name: z.string().nullable(),
  company_logo: z.string().nullable(),
  company_description: z.string().nullable().optional(),
  is_featured: z.boolean().optional(),
});
export type Job = z.infer<typeof JobSchema>;

export const SavedJobSchema = JobSchema.extend({
  saved_at: z.string(),
});
export type SavedJob = z.infer<typeof SavedJobSchema>;


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
