"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";

import { BaseField } from "@/components/form/base-field";
import { getFieldState } from "@/components/form/utils";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";

type PasswordFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Input>,
  "id" | "value" | "onChange" | "onBlur" | "type"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;
  startIcon?: React.ReactNode;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function PasswordField<TField extends AnyFieldApi>({
  field,
  label = "Password",
  description,
  startIcon,
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
        <div
          className={
            startIcon
              ? cn(
                  "flex items-center gap-2 rounded-xl border bg-slate-50/50 px-3 py-1 relative transition-colors",
                  "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
                  invalid
                    ? "border-destructive ring-2 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40"
                    : "border-border"
                )
              : "relative"
          }
        >
          {startIcon && <div className="shrink-0">{startIcon}</div>}
          <Input
            {...controlProps}
            {...props}
            type={showPassword ? "text" : "password"}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            className={
              startIcon
                ? "border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 aria-invalid:ring-0 text-sm pr-10"
                : "pr-10"
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className={
              startIcon
                ? "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                : "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            }
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
