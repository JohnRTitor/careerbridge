export const recruiterKeys = {
  all: ['recruiters'] as const,
  profile: () => [...recruiterKeys.all, 'profile'] as const,
  jobs: () => [...recruiterKeys.all, 'jobs'] as const,
  jobList: (filters: { page?: number; limit?: number }) => [...recruiterKeys.jobs(), { filters }] as const,
  applications: () => [...recruiterKeys.all, 'applications'] as const,
  applicationList: (filters: { page?: number; limit?: number }) => [...recruiterKeys.applications(), { filters }] as const,
  analytics: () => [...recruiterKeys.all, 'analytics'] as const,
  applicantsAll: () => [...recruiterKeys.all, 'applicants'] as const,
  applicants: (jobId: string) => [...recruiterKeys.applicantsAll(), jobId] as const,
};
