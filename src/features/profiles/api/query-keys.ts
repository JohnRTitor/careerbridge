export const profileKeys = {
  all: ['profiles'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: () => [...profileKeys.details(), 'me'] as const,
  resumes: () => [...profileKeys.all, 'resumes'] as const,
  preferences: () => [...profileKeys.all, 'preferences'] as const,
  publicDetails: () => [...profileKeys.all, 'public'] as const,
  publicDetail: (userId: string) => [...profileKeys.publicDetails(), userId] as const,
};
