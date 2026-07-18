import { rpcClient } from "@/lib/api/rpc";
import { InferResponseType } from "hono/client";
import type { ApplyJob as ApplyJobPayload } from "@server/features/applications/applications.schemas";

type ApplicationsRoute = typeof rpcClient.api.applications.$get;
type Res = InferResponseType<ApplicationsRoute, 200>;

type ArrayElement<ArrayType extends readonly unknown[] | undefined> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Application = ArrayElement<NonNullable<Res extends { data: infer D } ? D : never>>;

export type { ApplyJobPayload };
