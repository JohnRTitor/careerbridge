import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <Card className="bg-card">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <Skeleton className="size-12 rounded-xl" />
          <Skeleton className="size-8 rounded-full" />
        </div>
        <div>
          <Skeleton className="h-6 mb-2 w-[70%]" />
          <Skeleton className="h-4 w-[45%]" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div>
            <Skeleton className="h-5 w-20 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
