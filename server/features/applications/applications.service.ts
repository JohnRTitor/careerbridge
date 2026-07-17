import { applicationsRepository } from "./applications.repository";
import { jobsService } from "../jobs/jobs.service";
import { ConflictError, BadRequestError, NotFoundError } from "../../shared/errors";
import type { GetUserApplicationsInput, ApplyForJobInput, WithdrawApplicationInput } from "./applications.schemas";

export async function getUserApplications(input: GetUserApplicationsInput) {
  return applicationsRepository.getUserApplications(input);
}

export async function applyForJob(input: ApplyForJobInput) {
  const { jobId, candidateId } = input;
  // Note: we update this to the future structure of jobsService
  const job = await jobsService.getJobById({ jobId });
  
  if (job.status !== "open") {
    throw new BadRequestError("Cannot apply to a job that is not open");
  }

  const existing = await applicationsRepository.getApplication({ jobId, candidateId });
  if (existing) {
    throw new ConflictError("You have already applied to this job");
  }

  return applicationsRepository.applyForJob(input);
}

export async function withdrawApplication(input: WithdrawApplicationInput) {
  const success = await applicationsRepository.withdrawApplication(input);
  if (!success) {
    throw new NotFoundError("Application not found");
  }
}

export const applicationsService = {
  getUserApplications,
  applyForJob,
  withdrawApplication,
};
