export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return {
    success: true as const,
    data,
    meta,
  };
}

export function fail(message: string, error?: { code?: string; details?: unknown }) {
  return {
    success: false as const,
    error: {
      message,
      ...error,
    },
  };
}
