import { z } from "zod";

export const ProfileVisibilitySchema = z.enum(["public", "private"]);

export const UpdateProfileSchema = z
  .object({
    headline: z.string().optional(),
    about: z.string().optional(),
    visibility: ProfileVisibilitySchema.optional(),
    portfolio_url: z.url().optional().or(z.literal("")),
  })
  .meta({ id: "UpdateUserProfile" });

export const ResumeUploadSchema = z
  .object({
    resume_url: z.url(),
  })
  .meta({ id: "ResumeUpload" });

export const EducationSchema = z
  .object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    field_of_study: z.string().optional(),
    start_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
    end_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" })
      .optional(),
    description: z.string().optional(),
  })
  .meta({ id: "EducationEntry" });

export const UpdateEducationSchema = EducationSchema.partial().meta({
  id: "UpdateEducation",
});

export const ExperienceSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    start_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
    end_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" })
      .optional(),
    description: z.string().optional(),
  })
  .meta({ id: "ExperienceEntry" });

export const UpdateExperienceSchema = ExperienceSchema.partial().meta({
  id: "UpdateExperience",
});

// Input Types
export type GetProfileInput = {
  userId: string;
};

export type UpdateProfileInput = {
  userId: string;
  data: z.infer<typeof UpdateProfileSchema>;
};

export type UpdateResumeInput = {
  userId: string;
  data: z.infer<typeof ResumeUploadSchema>;
};

export type AddEducationInput = {
  userId: string;
  data: z.infer<typeof EducationSchema>;
};

export type UpdateEducationInput = {
  educationId: string;
  userId: string;
  data: z.infer<typeof UpdateEducationSchema>;
};

export type DeleteEducationInput = {
  educationId: string;
  userId: string;
};

export type AddExperienceInput = {
  userId: string;
  data: z.infer<typeof ExperienceSchema>;
};

export type UpdateExperienceInput = {
  experienceId: string;
  userId: string;
  data: z.infer<typeof UpdateExperienceSchema>;
};

export type DeleteExperienceInput = {
  experienceId: string;
  userId: string;
};
