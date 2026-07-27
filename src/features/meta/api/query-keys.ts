export const metaKeys = {
  all: ["meta"] as const,
  skills: () => [...metaKeys.all, "skills"] as const,
  skillList: (query?: string) => [...metaKeys.skills(), { query }] as const,
  languages: () => [...metaKeys.all, "languages"] as const,
  languageList: (query?: string) => [...metaKeys.languages(), { query }] as const,
  currencies: () => [...metaKeys.all, "currencies"] as const,
};
