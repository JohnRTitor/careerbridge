import { z } from "zod";

export const HomepageStatsSchema = z.object({
  total_open_jobs: z.number(),
  total_jobs: z.number(),
  total_companies: z.number(),
  total_users: z.number(),
  total_applications: z.number(),
}).meta({ id: "HomepageStats" });

export const JobCategorySchema = z.object({
  industry: z.string(),
  job_count: z.number(),
}).meta({ id: "JobCategory" });

export type HomepageStats = z.infer<typeof HomepageStatsSchema>;
export type JobCategory = z.infer<typeof JobCategorySchema>;
