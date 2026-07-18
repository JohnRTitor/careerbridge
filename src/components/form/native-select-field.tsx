"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import { NativeSelect } from "@/components/ui/native-select";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

type NativeSelectFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof NativeSelect>,
  "id" | "value" | "onChange" | "onBlur"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  
  options?: { label: string; value: string | number }[];
  children?: React.ReactNode; // NativeSelectOption elements
};

export function NativeSelectField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  options,
  children,
  ...props
}: NativeSelectFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <NativeSelect
        id={field.name}
        aria-invalid={invalid}
        {...props}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      >
        {options ? options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        )) : children}
      </NativeSelect>

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
