import { z } from "zod";
import "zod-openapi";
import { JobTypeSchema, JobStatusSchema } from "../jobs/jobs.schemas";

export const CreateJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  company_id: z.string().uuid().optional(),
  location: z.string().optional(),
  type: JobTypeSchema.optional().default("full-time"),
  salary_range: z.string().optional(),
  status: JobStatusSchema.optional().default("open"),
}).meta({ id: "CreateJob" });

export const UpdateJobSchema = CreateJobSchema.partial().meta({ id: "UpdateJob" });

export const ApplicationStatusSchema = z.enum(["pending", "reviewing", "shortlisted", "rejected", "hired"]);

export const UpdateApplicationStatusSchema = z.object({
  status: ApplicationStatusSchema,
}).meta({ id: "UpdateApplicationStatus" });

// Input Types
export type CreateJobInput = {
  recruiterId: string;
  data: z.infer<typeof CreateJobSchema>;
};

export type UpdateJobInput = {
  jobId: string;
  recruiterId: string;
  data: z.infer<typeof UpdateJobSchema>;
};

export type DeleteJobInput = {
  jobId: string;
  recruiterId: string;
};

export type GetJobApplicantsInput = {
  jobId: string;
  recruiterId: string;
};

export type UpdateApplicationStatusInput = {
  applicationId: string;
  recruiterId: string;
  data: z.infer<typeof UpdateApplicationStatusSchema>;
};

export type GetAnalyticsInput = {
  recruiterId: string;
};
