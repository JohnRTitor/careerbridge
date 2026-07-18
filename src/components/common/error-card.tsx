import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon, type IconSvgElement as IconSvgObject } from "@hugeicons/react";
import { Alert01Icon } from "@hugeicons/core-free-icons";

interface ErrorCardProps {
  title?: string;
  message: string;
  icon?: IconSvgObject;
  onRetry?: () => void;
  className?: string;
}

export function ErrorCard({
  title = "An error occurred",
  message,
  icon = Alert01Icon,
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <Alert variant="destructive" className={className}>
      <HugeiconsIcon icon={icon} className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col items-start gap-4">
        <p>{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
