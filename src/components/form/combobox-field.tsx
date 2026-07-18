"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
} from "@/components/ui/combobox";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";

type ComboboxFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof ComboboxPrimitive.Root>,
  "value" | "onValueChange" | "defaultValue"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;

  inputClassName?: string;
  contentClassName?: string;

  children: React.ReactNode; // ComboboxList with ComboboxItem
};

export function ComboboxField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  placeholder,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  inputClassName,
  contentClassName,
  children,
  ...props
}: ComboboxFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <Combobox
        {...props}
        value={field.state.value}
        onValueChange={(val) => field.handleChange(val)}
      >
        <ComboboxInput
          id={field.name}
          aria-invalid={invalid}
          placeholder={placeholder}
          className={inputClassName}
        />
        <ComboboxContent className={contentClassName}>
          {children}
        </ComboboxContent>
      </Combobox>

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
