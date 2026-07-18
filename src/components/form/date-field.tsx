"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";
import { format } from "date-fns";

import { getFieldState } from "@/components/form/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon } from "@hugeicons/core-free-icons";

type DateFieldProps<TField extends AnyFieldApi> = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "selected" | "onSelect" | "id"
> & {
  field: TField;

  label?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;

  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
};

export function DateField<TField extends AnyFieldApi>({
  field,
  label,
  description,
  placeholder = "Pick a date",
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...props
}: DateFieldProps<TField>) {
  const { invalid, error } = getFieldState(field);
  const value = field.state.value as Date | undefined;

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={field.name}
              aria-invalid={invalid}
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                invalid && "border-destructive focus-visible:ring-destructive/30"
              )}
            />
          }
        >
          <HugeiconsIcon icon={Calendar01Icon} className="mr-2" size={16} />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            {...props}
            mode="single"
            selected={value}
            onSelect={(date) => field.handleChange(date)}
          />
        </PopoverContent>
      </Popover>

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
