"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type PasswordFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof PasswordInput>,
  "id" | "value" | "onChange" | "onBlur" | "type"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;
  startIcon?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function PasswordField<TField extends AnyFieldApi>({
  field,
  label = "Password",
  description,
  startIcon,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: PasswordFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <div
        className={
          startIcon
            ? cn(
                "flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-1 relative transition-colors",
                "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
                invalid
                  ? "border-destructive ring-2 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40"
                  : "border-border"
              )
            : "relative"
        }
      >
        {startIcon && <div className="shrink-0">{startIcon}</div>}
        <PasswordInput
          id={field.name}
          aria-invalid={invalid}
          {...props}
          value={field.state.value as string}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className={
            startIcon
              ? "border-0 bg-transparent dark:bg-transparent px-0 shadow-none focus-visible:ring-0 aria-invalid:ring-0 text-sm"
              : ""
          }
        />
      </div>

      {!error && description && (
        <FieldDescription className={descriptionClassName}>
          {description}
        </FieldDescription>
      )}

      {error && (
        <FieldError className={errorClassName}>
          {error}
        </FieldError>
      )}
    </Field>
  );
}
