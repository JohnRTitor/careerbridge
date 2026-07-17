import { auditRepository } from "./audit.repository";
import type { LogActionInput, GetLogsInput } from "./audit.types";

export async function logAction(input: LogActionInput) {
  try {
    await auditRepository.logAction(input);
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
}

export async function getLogs(input: GetLogsInput) {
  const { page = 1, limit = 10 } = input;
  const offset = (page - 1) * limit;

  const { data, total } = await auditRepository.getLogs({ ...input, limit, offset });
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

export const auditService = {
  logAction,
  getLogs,
};
