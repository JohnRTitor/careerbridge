import { AppError, type ErrorResponse, type SuccessResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      credentials: "include",
    });

    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok || data.success === false) {
      const errorData = data as ErrorResponse;
      throw new AppError(
        errorData.message || "An error occurred",
        errorData.error?.code || "UNKNOWN_ERROR",
        errorData.error?.details
      );
    }

    return (data as SuccessResponse<T>).data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      error instanceof Error ? error.message : "Network error",
      "NETWORK_ERROR"
    );
  }
}
