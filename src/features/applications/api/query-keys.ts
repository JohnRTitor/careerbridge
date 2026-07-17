export const applicationKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationKeys.all, 'list'] as const,
  list: () => [...applicationKeys.lists()] as const, // For user's applications
};
