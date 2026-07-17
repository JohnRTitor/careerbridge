import { z } from "zod";
import { 
  SearchMetaSchema, 
  CreateSkillSchema, 
  CreateLanguageSchema,
  SkillSchema,
  LanguageSchema
} from "@server/features/meta/meta.schemas";

export type SearchMetaPayload = z.infer<typeof SearchMetaSchema>;
export type CreateSkillPayload = z.infer<typeof CreateSkillSchema>;
export type CreateLanguagePayload = z.infer<typeof CreateLanguageSchema>;

export type Skill = z.infer<typeof SkillSchema> & { id: string };
export type Language = z.infer<typeof LanguageSchema> & { id: string };
