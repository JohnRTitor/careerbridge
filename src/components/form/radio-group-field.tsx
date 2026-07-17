"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { RadioGroup } from "@/components/ui/radio-group";
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
        <RadioGroup
          {...controlProps}
          {...props}
          value={field.state.value}
          onValueChange={(val) => field.handleChange(val)}
        >
          {children}
        </RadioGroup>
      )}
    </BaseField>
  );
}
