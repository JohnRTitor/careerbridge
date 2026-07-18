import type { ApplyJob as ApplyJobPayload } from "@server/features/applications/applications.schemas";

export type Application = {
  id: string;
  job_id: string;
  candidate_id: string;
  resume_id: string | null;
  cover_letter: string | null;
  status: "reviewing" | "interviewing" | "offered" | "rejected";
  applied_at: string;
  updated_at: string;
  job_title: string;
  company_name: string | null;
  company_logo: string | null;
};

export type { ApplyJobPayload };
