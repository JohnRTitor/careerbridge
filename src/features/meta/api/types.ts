import { z } from "zod";
import { 
  SearchMetaSchema, 
  CreateSkillSchema, 
  CreateLanguageSchema,
} from "@server/features/meta/meta.schemas";

export type SearchMetaPayload = z.infer<typeof SearchMetaSchema>;
export type CreateSkillPayload = z.infer<typeof CreateSkillSchema>;
export type CreateLanguagePayload = z.infer<typeof CreateLanguageSchema>;

export type Skill = { id: string; name: string };
export type Language = { id: string; name: string };
