export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface Profile {
  user_id: string;
  headline?: string;
  about?: string;
  visibility: "public" | "private";
  portfolio_url?: string;
  resume_url?: string;
  education: Education[];
  experience: Experience[];
}

export type UpdateProfilePayload = {
  headline?: string;
  about?: string;
  visibility?: "public" | "private";
  portfolio_url?: string;
};

export type ResumeUploadPayload = {
  resume_url: string;
};

export type AddEducationPayload = Omit<Education, "id">;
export type UpdateEducationPayload = Partial<AddEducationPayload>;

export type AddExperiencePayload = Omit<Experience, "id">;
export type UpdateExperiencePayload = Partial<AddExperiencePayload>;
