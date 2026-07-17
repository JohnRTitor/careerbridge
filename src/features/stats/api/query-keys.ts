export const statsKeys = {
  all: ['stats'] as const,
  homepage: () => [...statsKeys.all, 'homepage'] as const,
  categories: () => [...statsKeys.all, 'categories'] as const,
};
