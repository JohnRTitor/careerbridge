import { jobsService } from "@server/features/jobs/jobs.service";
import type { SearchJobsInput, GetJobByIdInput } from "@server/features/jobs/jobs.schemas";
import { cacheTag } from "next/cache";

export async function searchJobsCached(input: SearchJobsInput) {
  "use cache";
  cacheTag("jobs", "jobs:list");
  return jobsService.searchJobs(input);
}

export async function getJobByIdCached(input: GetJobByIdInput) {
  "use cache";
  cacheTag("jobs", "jobs:detail", `jobs:detail:${input.jobId}`);
  return jobsService.getJobById(input);
}
