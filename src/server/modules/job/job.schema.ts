import { z } from "zod";
import 'zod-openapi';

export const JobSchema = z.object({
  id: z.string().uuid().meta({ example: "550e8400-e29b-41d4-a716-446655440000" }),
  title: z.string().meta({ example: "Software Engineer" }),
  description: z.string().meta({ example: "We are looking for a full stack engineer..." }),
  recruiter_id: z.string().meta({ example: "user_123" }),
}).meta({ id: "Job" });

export const CreateJobSchema = z.object({
  title: z.string().min(3).meta({ example: "Software Engineer" }),
  description: z.string().min(10).meta({ example: "We are looking for a full stack engineer..." }),
}).meta({ id: "CreateJob" });

export const UpdateJobSchema = CreateJobSchema.partial().meta({ id: "UpdateJob" });
