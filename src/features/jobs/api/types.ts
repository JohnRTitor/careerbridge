import { rpcClient } from "@/lib/api/rpc";
import { InferResponseType } from "hono/client";
import type { JobSearchQuery as JobFilters } from "@server/features/jobs/jobs.schemas";

type JobsRoute = typeof rpcClient.api.jobs.$get;
type JobsRes = InferResponseType<JobsRoute, 200>;
type ArrayElement<ArrayType extends readonly unknown[] | undefined> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Job = ArrayElement<NonNullable<JobsRes extends { data: { jobs: infer J } } ? J : never>>;

type SavedJobsRoute = typeof rpcClient.api.jobs.saved.$get;
type SavedJobsRes = InferResponseType<SavedJobsRoute, 200>;

export type SavedJob = ArrayElement<NonNullable<SavedJobsRes extends { data: infer D } ? D : never>>;


export type { JobFilters };
