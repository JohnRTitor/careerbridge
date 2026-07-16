import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";


type FormInputFieldProps = Omit<
  React.ComponentProps<"input">,
  "value" | "onChange" | "onBlur"
> & {
  field: any;
  label?: React.ReactNode;
  description?: string;
  className?: string;
  labelClassName?: string;
};

export function FormInputField({
  field,
  label,
  description,
  className,
  labelClassName,
  ...rest
}: FormInputFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={field.name} className={labelClassName}>
          {label}
        </Label>
      )}

      <Input
        id={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        {...rest}
      />

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
