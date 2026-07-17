import { AnyFieldApi } from "@tanstack/react-form";

export type ResolvedFieldState = {
  invalid: boolean;
  error?: string;
};

export function getFieldState(field: AnyFieldApi): ResolvedFieldState {
  const { isTouched = false, isValid = true, errors = [] } = field.state.meta;

  const invalid = isTouched && !isValid;

  return {
    invalid,
    error: invalid
      ? errors
          .map((error) => {
            if (typeof error === "string") return error;
            if (error instanceof Error) return error.message;
            if (error && typeof error === "object" && "message" in (error as any)) {
              return String((error as any).message);
            }
            return JSON.stringify(error);
          })
          .join(", ")
      : undefined,
  };
}
