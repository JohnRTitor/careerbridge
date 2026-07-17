import { z } from "zod";
import { JobSearchQuerySchema } from "@server/features/jobs/jobs.schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";

export type Job = {
  id: string;
  company_id: string;
  recruiter_id: string;
  title: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  location: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string | null;
  status: "open" | "closed" | "draft";
  created_at: string;
  updated_at: string;
  company_name: string | null;
  company_logo: string | null;
  company_description?: string | null;
  is_featured?: boolean;
};

export type SavedJob = Job & {
  saved_at: string;
};

export type JobFilters = z.infer<typeof JobSearchQuerySchema>;
