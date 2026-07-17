"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { Input } from "@/components/ui/input";

import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";

type PasswordFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "value" | "onChange" | "onBlur" | "type"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function PasswordField<TField extends AnyFieldApi>({
  field,
  label = "Password",
  description,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: PasswordFieldProps<TField>) {
  const [showPassword, setShowPassword] = React.useState(false);

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
        <div className="relative">
          <Input
            {...controlProps}
            {...props}
            type={showPassword ? "text" : "password"}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            className="pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <HugeiconsIcon
              icon={showPassword ? EyeOffIcon : EyeIcon}
              size={18}
            />
          </button>
        </div>
      )}
    </BaseField>
  );
}
