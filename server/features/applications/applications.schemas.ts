import { z } from "zod";

export const ApplyJobSchema = z
  .object({
    resume_id: z.uuid().optional(),
    cover_letter: z.string().optional(),
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
