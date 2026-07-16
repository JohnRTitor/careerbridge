import { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";

export type SuccessResponse<T> = {
  success: true;
  message?: string;
  data: T;
};

export type ErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
    details?: unknown;
  };
};

export function ok<T>(c: Context, data: T, message = "Success") {
  return c.json<SuccessResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    200
  );
}

export function created<T>(c: Context, data: T, message = "Created") {
  return c.json<SuccessResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    201
  );
}

export function noContent(c: Context) {
  return c.body(null, 204);
}

export function fail(c: Context, status: StatusCode, message: string, code: string, details?: unknown) {
  return c.json<ErrorResponse>(
    {
      success: false,
      message,
      error: {
        code,
        details,
      },
    },
    status as any
  );
}
