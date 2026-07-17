import { z } from "zod";

export const SearchMetaSchema = z.object({
  query: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const CreateSkillSchema = z.object({
  name: z.string().min(1).max(255),
});

export const CreateLanguageSchema = z.object({
  name: z.string().min(1).max(255),
});

export type SearchMetaInput = z.infer<typeof SearchMetaSchema>;
export type CreateSkillInput = z.infer<typeof CreateSkillSchema>;
export type CreateLanguageInput = z.infer<typeof CreateLanguageSchema>;
