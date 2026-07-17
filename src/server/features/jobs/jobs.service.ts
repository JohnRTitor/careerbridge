import { jobsRepository } from "./jobs.repository";
import { NotFoundError, BadRequestError } from "../../shared/errors";
import type { SearchJobsInput, GetJobByIdInput, SaveJobInput, UnsaveJobInput, GetRecommendationsInput } from "./jobs.schemas";

export async function searchJobs(input: SearchJobsInput) {
  const { page = 1, limit = 10 } = input;
  const offset = (page - 1) * limit;

  const { data, total } = await jobsRepository.searchJobs({
    ...input,
    limit,
    offset,
  });

  return {
    jobs: data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getJobById(input: GetJobByIdInput) {
  const job = await jobsRepository.getJobById(input);
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  return job;
}

export async function saveJob(input: SaveJobInput) {
  const { jobId } = input;
  // Check if job exists
  await getJobById({ jobId });
  const success = await jobsRepository.saveJob(input);
  if (!success) {
    // It's fine if it was already saved
  }
  return { saved: true };
}

export async function unsaveJob(input: UnsaveJobInput) {
  await jobsRepository.unsaveJob(input);
  return { saved: false };
}

export async function getRecommendations(input: GetRecommendationsInput) {
  return jobsRepository.getRecommendations({ ...input, limit: 5 });
}

export async function getSavedJobs(input: any) {
  return jobsRepository.getSavedJobs(input);
}

export const jobsService = {
  searchJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getRecommendations,
  getSavedJobs,
};
