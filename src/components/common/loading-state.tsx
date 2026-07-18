import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TextSkeleton } from "./skeletons/text-skeleton";
import { Spinner } from "@/components/ui/spinner";

interface LoadingStateProps {
  type?: "card" | "table" | "spinner";
  count?: number;
  className?: string;
}

const TITLE_WIDTHS = ["w-[70%]", "w-[50%]", "w-[80%]", "w-[60%]", "w-[75%]"];
const SUBTITLE_WIDTHS = ["w-[40%]", "w-[30%]", "w-[45%]", "w-[35%]", "w-[25%]"];
const BADGE_WIDTHS = ["w-[15%]", "w-[25%]", "w-[20%]", "w-[30%]", "w-[10%]"];

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
              <TextSkeleton lines={3} className="mb-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={`space-y-4 ${className || ""}`}>
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="flex flex-col gap-2">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-2">
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className={`h-4 ${TITLE_WIDTHS[i % TITLE_WIDTHS.length]}`} />
                <Skeleton className={`h-3 ${SUBTITLE_WIDTHS[i % SUBTITLE_WIDTHS.length]}`} />
              </div>
              <Skeleton className={`h-8 ${BADGE_WIDTHS[i % BADGE_WIDTHS.length]}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
