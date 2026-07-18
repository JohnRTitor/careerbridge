"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import { RadioGroup } from "@/components/ui/radio-group";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

type RadioGroupFieldProps<TField extends AnyFieldApi> = Omit<
  RadioGroupPrimitive.Props,
  "value" | "onValueChange" | "defaultValue" | "id"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;

  children: React.ReactNode;
};

export function RadioGroupField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
  ...props
}: RadioGroupFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <RadioGroup
        id={field.name}
        aria-invalid={invalid}
        {...props}
        value={field.state.value}
        onValueChange={(val) => field.handleChange(val)}
      >
        {children}
      </RadioGroup>

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
