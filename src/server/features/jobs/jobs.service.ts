import { JobsRepository } from "./jobs.repository";
import { NotFoundError, BadRequestError } from "../../shared/errors";
import { z } from "zod";
import { JobSearchQuerySchema } from "./jobs.schemas";

export class JobsService {
  static async searchJobs(params: z.infer<typeof JobSearchQuerySchema>) {
    const { page = 1, limit = 10, query, location, type } = params;
    const offset = (page - 1) * limit;

    const { data, total } = await JobsRepository.searchJobs({
      query,
      location,
      type,
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

  static async getJobById(id: string) {
    const job = await JobsRepository.getJobById(id);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    return job;
  }

  static async saveJob(userId: string, jobId: string) {
    // Check if job exists
    await this.getJobById(jobId);
    const success = await JobsRepository.saveJob(userId, jobId);
    if (!success) {
      // It's fine if it was already saved
    }
    return { saved: true };
  }

  static async unsaveJob(userId: string, jobId: string) {
    await JobsRepository.unsaveJob(userId, jobId);
    return { saved: false };
  }

  static async getRecommendations(userId: string) {
    return JobsRepository.getRecommendations(userId, 5);
  }
}
