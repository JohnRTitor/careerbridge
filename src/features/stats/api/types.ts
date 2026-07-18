import { rpcClient } from "@/lib/api/rpc";
import { InferResponseType } from "hono/client";

type StatsRoute = typeof rpcClient.api.stats.$get;
export type HomepageStats = NonNullable<InferResponseType<StatsRoute, 200> extends { data: infer D } ? D : never>;

type CategoriesRoute = typeof rpcClient.api.stats.categories.$get;
type ArrayElement<ArrayType extends readonly unknown[] | undefined> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type JobCategory = ArrayElement<NonNullable<InferResponseType<CategoriesRoute, 200> extends { data: infer D } ? D : never>>;
