import { jobsRepository } from "./jobs.repository";
import { NotFoundError } from "../../shared/errors";
import type { SearchJobsInput, GetJobByIdInput, SaveJobInput, UnsaveJobInput, GetRecommendationsInput, GetSavedJobsInput, Job, SavedJob, JobApplicationForm, UpdateApplicationFormInput } from "./jobs.schemas";
import { UnauthorizedError } from "../../shared/errors";

export async function searchJobs(input: SearchJobsInput): Promise<{ jobs: Job[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
  const { page = 1, limit = 10 } = input;
  const offset = (page - 1) * limit;

  const { data, total } = await jobsRepository.searchJobs({
    ...input,
    limit,
    offset,
  });

  return {
    jobs: data as Job[],
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getJobById(input: GetJobByIdInput): Promise<Job> {
  const job = await jobsRepository.getJobById(input);
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  return job as Job;
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

export async function getRecommendations(input: GetRecommendationsInput): Promise<Job[]> {
  const data = await jobsRepository.getRecommendations({ ...input, limit: 5 });
  return data as Job[];
}

export async function getSavedJobs(input: GetSavedJobsInput): Promise<SavedJob[]> {
  const data = await jobsRepository.getSavedJobs(input);
  return data as SavedJob[];
}

export async function getApplicationForm(input: GetJobByIdInput): Promise<JobApplicationForm> {
  const form = await jobsRepository.getApplicationForm(input.jobId);
  if (!form) {
    throw new NotFoundError("Application form not found for this job");
  }
  return form as JobApplicationForm;
}

export async function updateApplicationForm(input: UpdateApplicationFormInput): Promise<JobApplicationForm> {
  const job = await jobsRepository.getJobById({ jobId: input.jobId });
  if (!job) throw new NotFoundError("Job not found");
  
  if (job.created_by !== input.recruiterId) {
    throw new UnauthorizedError("You are not authorized to update this job's form");
  }
  
  const form = await jobsRepository.updateApplicationForm(input.jobId, input.data);
  return form as JobApplicationForm;
}

export const jobsService = {
  searchJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getRecommendations,
  getSavedJobs,
  getApplicationForm,
  updateApplicationForm,
};
