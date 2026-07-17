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
          .map((error) =>
            error instanceof Error ? error.message : String(error),
          )
          .join(", ")
      : undefined,
  };
}
