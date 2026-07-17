"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TextFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "value" | "onChange" | "onBlur"
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

export function TextField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  startIcon,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: TextFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <BaseField
      id={field.name}
      label={label}
      description={description}
      error={error}
      invalid={invalid}
      className={className}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
    >
      {(controlProps) => (
        <div
          className={
            startIcon
              ? cn(
                  "flex items-center gap-2 rounded-xl border bg-muted/50 px-3 py-1 transition-colors",
                  "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
                  invalid
                    ? "border-destructive ring-2 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40"
                    : "border-border"
                )
              : ""
          }
        >
          {startIcon && <div className="shrink-0">{startIcon}</div>}
          <Input
            {...controlProps}
            {...props}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            className={
              startIcon
                ? "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 aria-invalid:ring-0 text-sm"
                : className
            }
          />
        </div>
      )}
    </BaseField>
  );
}
