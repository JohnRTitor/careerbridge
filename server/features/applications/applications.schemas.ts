import { z } from "zod";

export const ApplicationStatusSchema = z.enum([
  "draft",
  "pending",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
]);
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;

export const ApplyJobSchema = z
  .object({
    form_id: z.uuid().optional(),
    resume_id: z.uuid().optional(),
    cover_letter: z.string().optional(),
    is_draft: z.boolean().optional(),
    answers: z.record(z.string(), z.any()).optional(),
  })
  .meta({ id: "ApplyJob" });

export type ApplyJob = z.infer<typeof ApplyJobSchema>;

// Input Types
export type GetUserApplicationsInput = {
  userId: string;
};

export type ApplyForJobInput = {
  jobId: string;
  candidateId: string;
  data: z.infer<typeof ApplyJobSchema>;
};

export type GetApplicationInput = {
  jobId: string;
  candidateId: string;
};

export type WithdrawApplicationInput = {
  applicationId: string;
  candidateId: string;
};
