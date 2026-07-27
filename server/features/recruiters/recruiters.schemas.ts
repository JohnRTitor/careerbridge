import { z } from "zod";
import { JobTypeSchema, JobStatusSchema } from "../jobs/jobs.schemas";
import { PaginationQuerySchema } from "../../shared/schemas";

export const CreateJobBaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  company_id: z.uuid().optional(),
  location: z.string().optional(),
  type: JobTypeSchema.optional().default("full-time"),
  minimum_salary: z.number().positive().optional(),
  maximum_salary: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  status: JobStatusSchema.optional().default("open"),
});

const validateSalaryRange = (
  data: { minimum_salary?: number; maximum_salary?: number },
  ctx: z.RefinementCtx
) => {
  if (
    data.minimum_salary !== undefined &&
    data.maximum_salary !== undefined &&
    data.minimum_salary > data.maximum_salary
  ) {
    ctx.addIssue({
      code: "custom",
      message: "Maximum salary must be greater than or equal to minimum salary",
      path: ["maximum_salary"],
    });
  }
};

export const CreateJobSchema = CreateJobBaseSchema
  .superRefine(validateSalaryRange)
  .meta({ id: "CreateJob" });

export type CreateJob = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = CreateJobBaseSchema.partial()
  .superRefine(validateSalaryRange)
  .meta({ id: "UpdateJob" });

export type UpdateJob = z.infer<typeof UpdateJobSchema>;

export const ApplicationStatusSchema = z.enum([
  "pending",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
]);

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const UpdateApplicationStatusSchema = z
  .object({
    status: ApplicationStatusSchema,
  })
  .meta({ id: "UpdateApplicationStatus" });

export type UpdateApplicationStatus = z.infer<
  typeof UpdateApplicationStatusSchema
>;

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

export const GetRecruiterJobsSchema = PaginationQuerySchema.extend({}).meta({
  id: "GetRecruiterJobsQuery",
});
export const GetRecruiterApplicationsSchema = PaginationQuerySchema.extend(
  {},
).meta({ id: "GetRecruiterApplicationsQuery" });

export type GetRecruiterJobsInput = {
  recruiterId: string;
} & z.infer<typeof GetRecruiterJobsSchema>;

export type GetRecruiterApplicationsInput = {
  recruiterId: string;
} & z.infer<typeof GetRecruiterApplicationsSchema>;

// Recruiter Profile
export const RecruiterProfileSchema = z.object({
  company_id: z.uuid().optional(),
  designation: z.string().optional(),
  phone: z.string().optional(),
});
export type RecruiterProfile = z.infer<typeof RecruiterProfileSchema>;

export const UpdateRecruiterProfileSchema = RecruiterProfileSchema.partial();
export type UpdateRecruiterProfile = z.infer<
  typeof UpdateRecruiterProfileSchema
>;

export type GetRecruiterProfileInput = {
  userId: string;
};
export type UpsertRecruiterProfileInput = {
  userId: string;
  data: z.infer<typeof RecruiterProfileSchema>;
};
