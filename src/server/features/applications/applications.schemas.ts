import { z } from "zod";
import "zod-openapi";

export const ApplyJobSchema = z.object({
  resume_url: z.string().url().optional(),
  cover_letter: z.string().optional(),
}).meta({ id: "ApplyJob" });
