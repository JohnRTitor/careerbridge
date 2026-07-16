import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";

export class AppError extends HTTPException {
  public code: string;
  public details?: unknown;

  constructor(status: StatusCode, message: string, code: string, details?: unknown) {
    super(status as any, { message });
    this.code = code;
    this.details = details;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details?: unknown) {
    super(400, message, "BAD_REQUEST", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(401, message, "UNAUTHORIZED", details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown) {
    super(403, message, "FORBIDDEN", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", details?: unknown) {
    super(404, message, "NOT_FOUND", details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: unknown) {
    super(409, message, "CONFLICT", details);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable Entity", details?: unknown) {
    super(422, message, "UNPROCESSABLE_ENTITY", details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error", details?: unknown) {
    super(500, message, "INTERNAL_SERVER_ERROR", details);
  }
}
