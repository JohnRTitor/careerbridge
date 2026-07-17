import { z } from "zod";
import { PaginationQuerySchema } from "../../shared/schemas";

export type LogActionInput = {
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, unknown>;
};

export type GetLogsInput = z.infer<typeof PaginationQuerySchema>;
