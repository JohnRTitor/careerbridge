import { metaRepository } from "./meta.repository";
import type { SearchMetaInput, CreateSkillInput, CreateLanguageInput } from "./meta.schemas";

export const metaService = {
  searchSkills: async (input: SearchMetaInput) => {
    return await metaRepository.searchSkills(input);
  },

  createSkill: async (input: CreateSkillInput) => {
    return await metaRepository.createSkill(input);
  },

  searchLanguages: async (input: SearchMetaInput) => {
    return await metaRepository.searchLanguages(input);
  },

  createLanguage: async (input: CreateLanguageInput) => {
    return await metaRepository.createLanguage(input);
  },
};
