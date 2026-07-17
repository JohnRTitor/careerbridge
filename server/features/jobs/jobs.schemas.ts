import { z } from "zod";
import { PaginationQuerySchema } from "../../shared/schemas";

export const JobTypeSchema = z.enum([
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
]);
export const JobStatusSchema = z.enum(["open", "closed", "draft"]);

export const JobSearchQuerySchema = PaginationQuerySchema.extend({
  query: z.string().optional(),
  location: z.string().optional(),
  type: JobTypeSchema.optional(),
}).meta({ id: "JobSearchQuery" });

// Input Types
export type SearchJobsInput = z.infer<typeof JobSearchQuerySchema>;

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
