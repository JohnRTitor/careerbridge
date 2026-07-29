"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, EyeOffIcon, Tick02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useId, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type PasswordRequirement = {
  regex: RegExp;
  text: string;
};

export type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showStrengthIndicator?: boolean;
  requirements?: PasswordRequirement[];
};

const DEFAULT_REQUIREMENTS: PasswordRequirement[] = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
];

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrengthIndicator, requirements = DEFAULT_REQUIREMENTS, value, onChange, ...props }, ref) => {
    const id = useId();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [internalValue, setInternalValue] = useState("");

    const toggleVisibility = () => setIsVisible((prevState) => !prevState);

    const actualValue = value !== undefined ? (value as string) : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const checkStrength = (pass: string) => {
      return requirements.map((req) => ({
        met: req.regex.test(pass),
        text: req.text,
      }));
    };

    const strength = checkStrength(actualValue);

    const strengthScore = useMemo(() => {
      return strength.filter((req) => req.met).length;
    }, [strength]);

    const maxScore = requirements.length;

    const getStrengthColor = (score: number) => {
      if (score === 0) return "bg-border";
      if (score <= Math.ceil(maxScore * 0.25)) return "bg-red-500";
      if (score <= Math.ceil(maxScore * 0.5)) return "bg-orange-500";
      if (score < maxScore) return "bg-amber-500";
      return "bg-emerald-500";
    };

    const getStrengthText = (score: number) => {
      if (score === 0) return "Enter a password";
      if (score <= Math.ceil(maxScore * 0.5)) return "Weak password";
      if (score < maxScore) return "Medium password";
      return "Strong password";
    };

    return (
      <div className="w-full">
        <div className="relative">
          <Input
            ref={ref}
            aria-describedby={showStrengthIndicator ? `${id}-description` : undefined}
            className={cn("pe-9", className)}
            id={id}
            onChange={handleChange}
            type={isVisible ? "text" : "password"}
            value={value}
            {...props}
          />
          <button
            aria-controls={id}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={toggleVisibility}
            type="button"
          >
            <HugeiconsIcon icon={isVisible ? EyeOffIcon : EyeIcon} size={16} aria-hidden="true" />
          </button>
        </div>

        {showStrengthIndicator && (
          <>
            <div
              aria-label="Password strength"
              aria-valuemax={maxScore}
              aria-valuemin={0}
              aria-valuenow={strengthScore}
              className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
              role="progressbar"
              tabIndex={-1}
            >
              <div
                className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                style={{ width: `${(strengthScore / maxScore) * 100}%` }}
              />
            </div>

            <p
              className="mb-2 font-medium text-foreground text-sm"
              id={`${id}-description`}
            >
              {getStrengthText(strengthScore)}. Must contain:
            </p>

            <ul aria-label="Password requirements" className="space-y-1.5">
              {strength.map((req) => (
                <li className="flex items-center gap-2" key={req.text}>
                  {req.met ? (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      className="text-emerald-500"
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    <HugeiconsIcon
                      icon={Cancel01Icon}
                      className="text-muted-foreground/80"
                      size={16}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                  >
                    {req.text}
                    <span className="sr-only">
                      {req.met ? " - Requirement met" : " - Requirement not met"}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
