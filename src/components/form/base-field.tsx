"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type BaseFieldControlProps = {
  id: string;
  disabled?: boolean;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
};

export type BaseFieldProps = {
  id: string;

  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;

  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;

  children: (props: BaseFieldControlProps) => React.ReactNode;
};

export function BaseField({
  id,
  label,
  description,
  error,
  required = false,
  invalid = false,
  disabled = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
}: BaseFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <div className={cn("space-y-2", className)} data-slot="form-field">
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            labelClassName,
          )}
        >
          {label}

          {required && (
            <span aria-hidden="true" className="ml-1 text-destructive">
              *
            </span>
          )}
        </label>
      )}

      {children({
        id,
        disabled,
        "aria-invalid": invalid,
        "aria-describedby":
          ariaDescribedBy.length > 0 ? ariaDescribedBy : undefined,
      })}

      {!error && description && (
        <p
          id={descriptionId}
          className={cn("text-xs text-muted-foreground", descriptionClassName)}
        >
          {description}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className={cn("text-xs font-medium text-destructive", errorClassName)}
        >
          {error}
        </p>
      )}
    </div>
  );
}
