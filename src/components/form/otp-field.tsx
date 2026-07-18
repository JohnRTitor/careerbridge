"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { getFieldState } from "@/components/form/utils";
import { InputOTP } from "@/components/ui/input-otp";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

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
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <InputOTP
        id={field.name}
        aria-invalid={invalid}
        {...props}
        value={field.state.value}
        onChange={(val) => field.handleChange(val)}
      >
        {children}
      </InputOTP>

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
