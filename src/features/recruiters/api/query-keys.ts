export const recruiterKeys = {
  all: ['recruiters'] as const,
  analytics: () => [...recruiterKeys.all, 'analytics'] as const,
  applicants: (jobId: string) => [...recruiterKeys.all, 'applicants', jobId] as const,
};
