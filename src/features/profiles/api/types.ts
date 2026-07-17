import { z } from "zod";
import { 
  UpdateProfileSchema, 
  ResumeUploadSchema, 
  EducationSchema, 
  UpdateEducationSchema,
  ExperienceSchema,
  UpdateExperienceSchema
} from "@server/features/profiles/profiles.schemas";
import { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/api/rpc";

type GetProfileRes = InferResponseType<typeof rpcClient.api.users.profile.$get, 200>;
export type Profile = GetProfileRes extends { data: infer P } ? P : never;

// Infer inner array types
export type Education = Profile extends { education: (infer E)[] } ? E : never;
export type Experience = Profile extends { experience: (infer E)[] } ? E : never;

export type UpdateProfilePayload = z.infer<typeof UpdateProfileSchema>;
export type ResumeUploadPayload = z.infer<typeof ResumeUploadSchema>;

export type AddEducationPayload = z.infer<typeof EducationSchema>;
export type UpdateEducationPayload = z.infer<typeof UpdateEducationSchema>;

export type AddExperiencePayload = z.infer<typeof ExperienceSchema>;
export type UpdateExperiencePayload = z.infer<typeof UpdateExperienceSchema>;
