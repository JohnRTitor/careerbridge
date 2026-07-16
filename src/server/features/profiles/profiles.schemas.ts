import { z } from "zod";
import "zod-openapi";

export const ProfileVisibilitySchema = z.enum(["public", "private"]);

export const UpdateProfileSchema = z.object({
  headline: z.string().optional(),
  about: z.string().optional(),
  visibility: ProfileVisibilitySchema.optional(),
  portfolio_url: z.string().url().optional().or(z.literal("")),
}).meta({ id: "UpdateUserProfile" });

export const ResumeUploadSchema = z.object({
  resume_url: z.string().url(),
}).meta({ id: "ResumeUpload" });

export const EducationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }).optional(),
  description: z.string().optional(),
}).meta({ id: "EducationEntry" });

export const ExperienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  start_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }),
  end_date: z.string().refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date" }).optional(),
  description: z.string().optional(),
}).meta({ id: "ExperienceEntry" });
