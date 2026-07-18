import type { 
  SearchMeta as SearchMetaPayload, 
  CreateSkill as CreateSkillPayload, 
  CreateLanguage as CreateLanguagePayload,
} from "@server/features/meta/meta.schemas";

export type { SearchMetaPayload, CreateSkillPayload, CreateLanguagePayload };

export type Skill = { id: string; name: string };
export type Language = { id: string; name: string };
