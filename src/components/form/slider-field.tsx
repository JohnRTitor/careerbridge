"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { Slider } from "@/components/ui/slider";

type SliderFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Slider>,
  "id" | "value" | "onValueChange" | "defaultValue"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function SliderField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: SliderFieldProps<TField>) {
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
        <Slider
          {...controlProps}
          {...props}
          value={field.state.value}
          onValueChange={(val) => field.handleChange(val)}
        />
      )}
    </BaseField>
  );
}
