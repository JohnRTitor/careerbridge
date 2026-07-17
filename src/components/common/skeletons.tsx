import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function JobCardSkeleton() {
  return (
    <Card className="bg-white">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <Skeleton className="size-12 rounded-xl" />
          <Skeleton className="size-5 rounded" />
        </div>
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
          <div>
            <Skeleton className="h-5 w-24 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryCardSkeleton() {
  return (
    <Card className="flex flex-col items-start gap-4 p-6">
      <Skeleton className="size-12 rounded-xl" />
      <div className="w-full">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </Card>
  );
}

export function CompanyCardSkeleton() {
  return (
    <Card className="flex flex-row items-center gap-4 p-5">
      <Skeleton className="size-14 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex flex-col items-end">
        <Skeleton className="size-5 mb-2 rounded" />
        <Skeleton className="h-4 w-12" />
      </div>
    </Card>
  );
}

export function StatSkeleton() {
  return (
    <div className="text-center flex flex-col items-center">
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
