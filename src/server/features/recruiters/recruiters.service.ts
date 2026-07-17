import { recruitersRepository } from "./recruiters.repository";
import { NotFoundError, ForbiddenError } from "../../shared/errors";
import type { CreateJobInput, UpdateJobInput, DeleteJobInput, GetJobApplicantsInput, UpdateApplicationStatusInput, GetAnalyticsInput, GetRecruiterProfileInput, UpsertRecruiterProfileInput } from "./recruiters.schemas";

export async function createJob(input: CreateJobInput) {
  return recruitersRepository.createJob(input);
}

export async function updateJob(input: UpdateJobInput) {
  const job = await recruitersRepository.updateJob(input);
  if (!job) throw new NotFoundError("Job not found or access denied");
  return job;
}

export async function deleteJob(input: DeleteJobInput) {
  const success = await recruitersRepository.deleteJob(input);
  if (!success) throw new NotFoundError("Job not found or access denied");
}

export async function getJobApplicants(input: GetJobApplicantsInput) {
  const applicants = await recruitersRepository.getJobApplicants(input);
  if (!applicants) throw new ForbiddenError("Access denied");
  return applicants;
}

export async function updateApplicationStatus(input: UpdateApplicationStatusInput) {
  const application = await recruitersRepository.updateApplicationStatus(input);
  if (!application) throw new NotFoundError("Application not found or access denied");
  return application;
}

export async function getAnalytics(input: GetAnalyticsInput) {
  return recruitersRepository.getAnalytics(input);
}

export async function getRecruiterProfile(input: GetRecruiterProfileInput) {
  const profile = await recruitersRepository.getRecruiterProfile(input);
  if (!profile) return { company_id: null, designation: null, phone: null, verified: false };
  return profile;
}

export async function upsertRecruiterProfile(input: UpsertRecruiterProfileInput) {
  return recruitersRepository.upsertRecruiterProfile(input);
}

export const recruitersService = {
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  updateApplicationStatus,
  getAnalytics,
  getRecruiterProfile,
  upsertRecruiterProfile,
};
