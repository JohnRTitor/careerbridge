"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { NativeSelect } from "@/components/ui/native-select";

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
  
  children: React.ReactNode; // NativeSelectOption elements
};

export function NativeSelectField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
  ...props
}: NativeSelectFieldProps<TField>) {
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
        <NativeSelect
          {...controlProps}
          {...props}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        >
          {children}
        </NativeSelect>
      )}
    </BaseField>
  );
}
