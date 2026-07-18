import type { 
  CreateJob as CreateJobPayload, 
  UpdateJob as UpdateJobPayload, 
  UpdateApplicationStatus as UpdateApplicationStatusPayload,
  RecruiterProfile as UpdateRecruiterProfilePayload
} from "@server/features/recruiters/recruiters.schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";

export type { CreateJobPayload, UpdateJobPayload, UpdateApplicationStatusPayload, UpdateRecruiterProfilePayload };

type GetApplicantsRes = InferResponseType<(typeof rpcClient.api.recruiters.jobs)[":id"]["applicants"]["$get"], 200>;
export type Applicant = GetApplicantsRes extends { data: (infer A)[] } ? A : never;
