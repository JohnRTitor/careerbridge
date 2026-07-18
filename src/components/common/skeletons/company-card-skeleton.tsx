import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanyCardSkeleton() {
  return (
    <Card className="flex flex-row items-center gap-4 p-5">
      <Skeleton className="size-14 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <Skeleton className="h-5 mb-2 w-[70%]" />
        <Skeleton className="h-4 w-[40%]" />
      </div>
      <div className="flex flex-col items-end">
        <Skeleton className="size-5 mb-2 rounded" />
        <Skeleton className="h-4 w-12" />
      </div>
    </Card>
  );
}
