"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Select as SelectPrimitive } from "@base-ui/react/select";

type SelectFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof SelectPrimitive.Root>,
  "value" | "onValueChange" | "defaultValue"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;

  triggerClassName?: string;
  contentClassName?: string;

  children: React.ReactNode; // The SelectItem components
};

export function SelectField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  placeholder,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  triggerClassName,
  contentClassName,
  children,
  ...props
}: SelectFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <Select
        {...props}
        value={field.state.value}
        onValueChange={(val) => field.handleChange(val)}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={invalid}
          className={triggerClassName}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {children}
        </SelectContent>
      </Select>

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
