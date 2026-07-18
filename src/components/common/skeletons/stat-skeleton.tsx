import { Skeleton } from "@/components/ui/skeleton";

export function StatSkeleton() {
  return (
    <div className="text-center flex flex-col items-center">
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}
