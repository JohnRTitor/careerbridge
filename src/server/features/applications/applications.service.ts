import { ApplicationsRepository } from "./applications.repository";
import { JobsService } from "../jobs/jobs.service";
import { ConflictError, BadRequestError } from "../../shared/errors";
import { z } from "zod";
import { ApplyJobSchema } from "./applications.schemas";

export class ApplicationsService {
  static async getUserApplications(userId: string) {
    return ApplicationsRepository.getUserApplications(userId);
  }

  static async applyForJob(jobId: string, candidateId: string, data: z.infer<typeof ApplyJobSchema>) {
    const job = await JobsService.getJobById(jobId);
    
    if (job.status !== "open") {
      throw new BadRequestError("Cannot apply to a job that is not open");
    }

    const existing = await ApplicationsRepository.getApplication(jobId, candidateId);
    if (existing) {
      throw new ConflictError("You have already applied to this job");
    }

    return ApplicationsRepository.applyForJob(jobId, candidateId, data);
  }
}
