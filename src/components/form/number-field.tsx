"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

type NumberFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "value" | "onChange" | "onBlur" | "type"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function NumberField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: NumberFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <Input
        id={field.name}
        aria-invalid={invalid}
        {...props}
        type="number"
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.valueAsNumber)}
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
