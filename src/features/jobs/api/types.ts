import { z } from "zod";
import { JobSearchQuerySchema } from "@server/features/jobs/jobs.schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";

type GetJobRes = InferResponseType<(typeof rpcClient.api.jobs)[":id"]["$get"], 200>;
export type Job = GetJobRes extends { data: infer J } ? J : never;

export type JobFilters = z.infer<typeof JobSearchQuerySchema>;
