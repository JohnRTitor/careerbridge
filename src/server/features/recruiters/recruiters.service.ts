import { RecruitersRepository } from "./recruiters.repository";
import { NotFoundError, ForbiddenError } from "../../shared/errors";
import { z } from "zod";
import { CreateJobSchema, UpdateApplicationStatusSchema } from "./recruiters.schemas";

export class RecruitersService {
  static async createJob(recruiterId: string, data: z.infer<typeof CreateJobSchema>) {
    return RecruitersRepository.createJob(recruiterId, data);
  }

  static async updateJob(jobId: string, recruiterId: string, data: Partial<z.infer<typeof CreateJobSchema>>) {
    const job = await RecruitersRepository.updateJob(jobId, recruiterId, data);
    if (!job) throw new NotFoundError("Job not found or access denied");
    return job;
  }

  static async deleteJob(jobId: string, recruiterId: string) {
    const success = await RecruitersRepository.deleteJob(jobId, recruiterId);
    if (!success) throw new NotFoundError("Job not found or access denied");
  }

  static async getJobApplicants(jobId: string, recruiterId: string) {
    const applicants = await RecruitersRepository.getJobApplicants(jobId, recruiterId);
    if (!applicants) throw new ForbiddenError("Access denied");
    return applicants;
  }

  static async updateApplicationStatus(applicationId: string, recruiterId: string, data: z.infer<typeof UpdateApplicationStatusSchema>) {
    const application = await RecruitersRepository.updateApplicationStatus(applicationId, recruiterId, data.status);
    if (!application) throw new NotFoundError("Application not found or access denied");
    return application;
  }

  static async getAnalytics(recruiterId: string) {
    return RecruitersRepository.getAnalytics(recruiterId);
  }
}
