import { z } from "zod";
import "zod-openapi";

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
}).meta({ id: "PaginationQuery" });

export const UuidParamSchema = z.object({
  id: z.string().uuid(),
}).meta({ id: "UuidParam" });

export const StatusResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
