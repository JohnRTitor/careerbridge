export interface Job {
  id: string;
  title: string;
  description: string;
  created_by: string;
  company_id?: string;
  location?: string;
  type: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  status: "open" | "closed" | "draft";
  work_mode?: "remote" | "hybrid" | "onsite";
  minimum_salary?: number;
  maximum_salary?: number;
  currency?: string;
  experience_min?: number;
  experience_max?: number;
  education_level?: string;
  application_deadline?: string;
  vacancies?: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobFilters {
  q?: string;
  location?: string;
  type?: string;
  work_mode?: string;
  experience_level?: string;
  page?: number;
  limit?: number;
}
