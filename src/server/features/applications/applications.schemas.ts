import { z } from "zod";
import "zod-openapi";

export const ApplyJobSchema = z.object({
  resume_url: z.string().url().optional(),
  cover_letter: z.string().optional(),
}).meta({ id: "ApplyJob" });

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
