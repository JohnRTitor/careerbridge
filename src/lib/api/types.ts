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

export class AppError extends Error {
  public code: string;
  public details?: unknown;

  constructor(message: string, code: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details;
  }
}
