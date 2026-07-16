"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, EyeOffIcon } from "@hugeicons/core-free-icons";

type FormPasswordFieldProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "onBlur" | "type"
> & {
  field: any;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  labelClassName?: string;
};

export function FormPasswordField({
  field,
  label = "Password",
  description,
  className,
  labelClassName,
  ...rest
}: FormPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={field.name} className={labelClassName}>
          {label}
        </Label>
      )}

      <div className="relative">
        <Input
          id={field.name}
          type={showPassword ? "text" : "password"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          className="pr-10"
          {...rest}
        />

        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          <HugeiconsIcon icon={showPassword ? EyeOffIcon : EyeIcon} size={18} />
        </button>
      </div>

      {!isInvalid && description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {isInvalid && field.state.meta.errors ? (
        <p className="text-sm font-medium text-destructive">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
