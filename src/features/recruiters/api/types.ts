import { z } from "zod";
import { 
  CreateJobSchema, 
  UpdateJobSchema, 
  UpdateApplicationStatusSchema,
  RecruiterProfileSchema
} from "@server/features/recruiters/recruiters.schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";

export type CreateJobPayload = z.infer<typeof CreateJobSchema>;
export type UpdateJobPayload = z.infer<typeof UpdateJobSchema>;
export type UpdateApplicationStatusPayload = z.infer<typeof UpdateApplicationStatusSchema>;
export type UpdateRecruiterProfilePayload = z.infer<typeof RecruiterProfileSchema>;

type GetApplicantsRes = InferResponseType<(typeof rpcClient.api.recruiters.jobs)[":id"]["applicants"]["$get"], 200>;
export type Applicant = GetApplicantsRes extends { data: (infer A)[] } ? A : never;
