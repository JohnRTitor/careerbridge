import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const onboardingSchema = z.object({
  accountType: z.enum(["candidate", "recruiter"], {
    message: "Please select an account type",
  }),
  dateOfBirth: z.date({
    message: "A date of birth is required.",
  }),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    message: "Please select a gender.",
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;

