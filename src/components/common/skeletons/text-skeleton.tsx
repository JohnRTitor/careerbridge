import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TextSkeletonProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
}

const WIDTH_PATTERNS = ["w-[90%]", "w-[75%]", "w-[85%]", "w-[65%]", "w-[80%]"];

export function TextSkeleton({ lines = 3, className, lineClassName }: TextSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", WIDTH_PATTERNS[i % WIDTH_PATTERNS.length], lineClassName)}
        />
      ))}
    </div>
  );
}
