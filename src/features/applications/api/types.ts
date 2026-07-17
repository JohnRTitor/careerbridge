import { Job } from "@/features/jobs/api/types";

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
  resume_id?: string;
  cover_letter?: string;
  recruiter_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rating?: number;
  applied_at: string;
  updated_at: string;
  job?: Job; // If backend joins the job details
}

export type ApplyJobPayload = {
  resume_id?: string;
  cover_letter?: string;
};
