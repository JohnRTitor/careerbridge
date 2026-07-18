import { z } from "zod";

export const PaginationQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  })
  .meta({ id: "PaginationQuery" });
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const UuidParamSchema = z
  .object({
    id: z.uuid(),
  })
  .meta({ id: "UuidParam" });
export type UuidParam = z.infer<typeof UuidParamSchema>;

export const StatusResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});
export type StatusResponse = z.infer<typeof StatusResponseSchema>;
