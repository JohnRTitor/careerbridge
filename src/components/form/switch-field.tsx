"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { Switch } from "@/components/ui/switch";

type SwitchFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Switch>,
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

export function SwitchField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: SwitchFieldProps<TField>) {
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
        <div className="flex items-center gap-2">
          <Switch
            {...controlProps}
            {...props}
            checked={field.state.value}
            onCheckedChange={(checked) => field.handleChange(checked)}
          />
        </div>
      )}
    </BaseField>
  );
}
