"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

type TextareaFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Textarea>,
  "id" | "value" | "onChange" | "onBlur"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function TextareaField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: TextareaFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <Textarea
        id={field.name}
        aria-invalid={invalid}
        {...props}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />

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
