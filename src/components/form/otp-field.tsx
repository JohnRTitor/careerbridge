"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { InputOTP } from "@/components/ui/input-otp";

type OTPFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof InputOTP>,
  "id" | "value" | "onChange" | "onBlur" | "render"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  
  children: React.ReactNode; // InputOTPGroup, etc.
};

export function OTPField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  children,
  ...props
}: OTPFieldProps<TField>) {
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
        <InputOTP
          {...controlProps}
          {...props}
          value={field.state.value}
          onChange={(val) => field.handleChange(val)}
        >
          {children}
        </InputOTP>
      )}
    </BaseField>
  );
}
