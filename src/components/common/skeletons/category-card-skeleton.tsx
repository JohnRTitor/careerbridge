import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CategoryCardSkeleton() {
  return (
    <Card className="flex flex-col items-start gap-4 p-6">
      <Skeleton className="size-12 rounded-xl" />
      <div className="w-full">
        <Skeleton className="h-5 mb-2 w-[80%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </Card>
  );
}
