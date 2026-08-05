"use client";

import * as React from "react";
import { AnyFieldApi } from "@tanstack/react-form";
import { format, isValid, parse } from "date-fns";
import { getFieldState } from "@/components/form/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverPanel,
  PopoverTrigger,
} from "@/components/animate-ui/components/base/popover";
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
  const rawValue = field.state.value;
  const isString = typeof rawValue === "string";
  const value = (isString && rawValue) ? new Date(rawValue as string) : (rawValue as Date | undefined);

  const [inputValue, setInputValue] = React.useState(() => value ? format(value, "yyyy-MM-dd") : "");
  const [month, setMonth] = React.useState<Date | undefined>(value || new Date());

  React.useEffect(() => {
    setInputValue(value ? format(value, "yyyy-MM-dd") : "");
    if (value) setMonth(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val) {
      const parsedDate = parse(val, "yyyy-MM-dd", new Date());
      if (isValid(parsedDate)) {
        if (isString) {
          field.handleChange(format(parsedDate, "yyyy-MM-dd") as any);
        } else {
          field.handleChange(parsedDate as any);
        }
        setMonth(parsedDate);
      }
    } else {
      if (isString) {
        field.handleChange("" as any);
      } else {
        field.handleChange(undefined as any);
      }
    }
  };

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (isString) {
        field.handleChange(format(selectedDate, "yyyy-MM-dd") as any);
      } else {
        field.handleChange(selectedDate as any);
      }
      setInputValue(format(selectedDate, "yyyy-MM-dd"));
      setMonth(selectedDate);
    } else {
      if (isString) {
        field.handleChange("" as any);
      } else {
        field.handleChange(undefined as any);
      }
      setInputValue("");
    }
  };

  return (
    <Field className={className} data-invalid={invalid}>
      {label && (
        <FieldLabel htmlFor={field.name} className={labelClassName}>
          {label}
        </FieldLabel>
      )}

      <Popover>
        <InputGroup className={cn(invalid && "border-destructive focus-within:ring-destructive/30 dark:focus-within:ring-destructive/40")}>
          <InputGroupAddon>
            <PopoverTrigger
              aria-label={placeholder}
              render={
                <Button aria-label={placeholder} size="icon-sm" variant="ghost" />
              }
            >
              <HugeiconsIcon icon={Calendar01Icon} aria-hidden="true" size={16} />
            </PopoverTrigger>
          </InputGroupAddon>
          <InputGroupInput
            id={field.name}
            aria-invalid={invalid}
            aria-label={placeholder}
            className="[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            type="date"
            value={inputValue}
          />
        </InputGroup>
        <PopoverPanel className="w-auto p-0" align="start" alignOffset={-4} sideOffset={8}>
          <DatePicker
            {...props}
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={value}
            onSelect={handleSelect}
          />
        </PopoverPanel>
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
