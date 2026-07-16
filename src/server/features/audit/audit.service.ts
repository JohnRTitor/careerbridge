import { AuditRepository } from "./audit.repository";
import { z } from "zod";
import { PaginationQuerySchema } from "../../shared/schemas";

export class AuditService {
  static async logAction(actorId: string, action: string, targetType: string, targetId?: string, details?: any) {
    try {
      await AuditRepository.logAction({
        actor_id: actorId,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
      });
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }
  }

  static async getLogs(params: z.infer<typeof PaginationQuerySchema>) {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const { data, total } = await AuditRepository.getLogs(limit, offset);
    return {
      logs: data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
