import { z } from "zod";
import { 
  HomepageStatsSchema, 
  JobCategorySchema 
} from "@server/features/stats/stats.schemas";

export type HomepageStats = z.infer<typeof HomepageStatsSchema>;
export type JobCategory = z.infer<typeof JobCategorySchema>;
