export const metaKeys = {
  all: ["meta"] as const,
  skills: (query?: string) => [...metaKeys.all, "skills", query] as const,
  languages: (query?: string) => [...metaKeys.all, "languages", query] as const,
};
