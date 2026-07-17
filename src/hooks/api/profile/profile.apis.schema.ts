import { z } from "zod";

const isValidDate = (dateString: string | undefined) => {
  if (!dateString) return false;

  const date = new Date(dateString);

  return (
    !isNaN(date.getTime()) &&
    date.getFullYear() > 1900 &&
    date.getFullYear() < 2100
  );
};

export const updateProfileSchema = z.object({
  headline: z
    .string()
    .max(150, "Headline must be less than 150 characters")
    .optional(),

  about: z
    .string()
    .max(5000, "About must be less than 5000 characters")
    .optional(),

  visibility: z
    .enum(["public", "private"], {
      message: "Visibility must be public or private",
    })
    .optional(),

  portfolio_url: z
    .string()
    .url("Invalid portfolio URL")
    .optional()
    .or(z.literal("")),
});

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required").max(150),

  degree: z.string().min(1, "Degree is required").max(150),

  field_of_study: z.string().max(150).optional(),

  start_date: z.string().refine(isValidDate, {
    message: "Invalid start date",
  }),

  end_date: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        return isValidDate(date);
      },
      {
        message: "Invalid end date",
      },
    ),

  description: z.string().max(1000).optional(),
});

export const experienceSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),

  company: z.string().min(1, "Company is required").max(150),

  location: z.string().max(150).optional(),

  start_date: z.string().refine(isValidDate, {
    message: "Invalid start date",
  }),

  end_date: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        return isValidDate(date);
      },
      {
        message: "Invalid end date",
      },
    ),

  description: z.string().max(2000).optional(),
});

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;

export type AddEducationPayload = z.infer<typeof educationSchema>;

export type AddExperiencePayload = z.infer<typeof experienceSchema>;

export type EducationInfo = {
  _id: string;
} & AddEducationPayload;

export type ExperienceInfo = {
  _id: string;
} & AddExperiencePayload;

export type ProfileInfo = {
  _id: string;
  headline?: string;
  about?: string;
  visibility?: "public" | "private";
  portfolio_url?: string;
  resume_url?: string;
  education: EducationInfo[];
  experience: ExperienceInfo[];
};
