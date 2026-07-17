import { Job } from "@/features/jobs/api/types";
import { Application } from "@/features/applications/api/types";

export type CreateJobPayload = Omit<Job, "id" | "created_at" | "updated_at" | "created_by" | "company_id"> & {
  company_id?: string;
};

export type UpdateJobPayload = Partial<CreateJobPayload>;

export type UpdateApplicationStatusPayload = {
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  recruiter_notes?: string;
  rating?: number;
};
