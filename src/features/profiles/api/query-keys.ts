export const profileKeys = {
  all: ['profiles'] as const,
  profile: () => [...profileKeys.all, 'profile'] as const,
};
