import { z } from "zod";
import { ApplyJobSchema } from "@server/features/applications/applications.schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";
import { Job } from "@/features/jobs/api/types";

type GetUserApplicationsRes = InferResponseType<typeof rpcClient.api.applications.$get, 200>;
export type Application = GetUserApplicationsRes extends { data: (infer A)[] } ? A : never;

export type ApplyJobPayload = z.infer<typeof ApplyJobSchema>;
