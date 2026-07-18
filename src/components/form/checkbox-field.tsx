"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

type CheckboxFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Checkbox>,
  "id" | "checked" | "onCheckedChange" | "onBlur" | "value"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function CheckboxField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: CheckboxFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid} orientation="horizontal">
      <div className="flex items-center gap-2">
        <Checkbox
          id={field.name}
          aria-invalid={invalid}
          {...props}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        {label && (
          <FieldLabel htmlFor={field.name} className={labelClassName}>
            {label}
          </FieldLabel>
        )}
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
