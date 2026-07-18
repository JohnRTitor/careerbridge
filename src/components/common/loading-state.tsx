import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

interface LoadingStateProps {
  type?: "card" | "table" | "spinner";
  count?: number;
  className?: string;
}

export function LoadingState({ type = "spinner", count = 3, className }: LoadingStateProps) {
  if (type === "spinner") {
    return (
      <div className={`flex flex-col items-center justify-center p-8 space-y-4 ${className || ""}`}>
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className={`grid gap-4 ${className || ""}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="bg-card">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`space-y-4 ${className || ""}`}>
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return null;
}
