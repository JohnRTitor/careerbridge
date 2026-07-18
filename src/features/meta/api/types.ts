import { rpcClient } from "@/lib/api/rpc";
import { InferResponseType } from "hono/client";
import type { 
  SearchMeta as SearchMetaPayload, 
  CreateSkill as CreateSkillPayload, 
  CreateLanguage as CreateLanguagePayload,
} from "@server/features/meta/meta.schemas";

export type { SearchMetaPayload, CreateSkillPayload, CreateLanguagePayload };

type SkillsRoute = typeof rpcClient.api.meta.skills.$get;
type SkillsRes = InferResponseType<SkillsRoute, 200>;
type ArrayElement<ArrayType extends readonly unknown[] | undefined> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export type Skill = ArrayElement<NonNullable<SkillsRes extends { data: infer D } ? D : never>>;

type LanguagesRoute = typeof rpcClient.api.meta.languages.$get;
type LanguagesRes = InferResponseType<LanguagesRoute, 200>;

export type Language = ArrayElement<NonNullable<LanguagesRes extends { data: infer D } ? D : never>>;

