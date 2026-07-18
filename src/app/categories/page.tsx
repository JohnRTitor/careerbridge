"use client";

import { useJobCategories } from "@/features/stats/api/queries";
import { Card } from "@/components/ui/card";
import { HugeiconsIcon, type IconSvgElement as IconSvgObject } from "@hugeicons/react";
import {
  CodeIcon,
  PenToolIcon,
  MegaphoneIcon,
  ChartBarLineIcon,
  StethoscopeIcon,
  GraduationCapIcon,
  Building01Icon,
  HeadphonesIcon,
  BriefcaseIcon,
} from "@hugeicons/core-free-icons";
import { CategoryCardSkeleton } from "@/components/common/skeletons";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const categoryIcons: Record<string, IconSvgObject> = {
  Engineering: CodeIcon,
  Technology: CodeIcon,
  Design: PenToolIcon,
  Marketing: MegaphoneIcon,
  Finance: ChartBarLineIcon,
  Healthcare: StethoscopeIcon,
  Education: GraduationCapIcon,
  "Real Estate": Building01Icon,
  Support: HeadphonesIcon,
};

function CategoriesContent() {
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useJobCategories();

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      <div className="bg-primary px-4 py-12 sm:py-16 sm:px-6 lg:px-8 border-b border-primary/20">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Browse by Category
          </h1>
          <p className="mt-2 text-primary-foreground/80 text-sm sm:text-base max-w-2xl mx-auto">
            Explore opportunities across the fields you care about most. Find
            roles that match your expertise.
          </p>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {isLoadingCategories ? (
            Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))
          ) : categoriesData && categoriesData.length > 0 ? (
            categoriesData.map((category) => {
              const IconComponent =
                categoryIcons[category.industry] || BriefcaseIcon;
              return (
                <Link
                  key={category.industry}
                  href={`/jobs?query=${encodeURIComponent(category.industry)}`}
                  className="block w-full"
                >
                  <Card className="group flex flex-col items-start gap-4 p-6 transition-all hover:border-primary hover:shadow-md h-full bg-card">
                    <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <HugeiconsIcon icon={IconComponent} className="size-6" />
                    </span>
                    <div>
                      <h3 className="font-semibold">{category.industry}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category.job_count.toLocaleString()} open jobs
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center text-center text-muted-foreground py-16 border rounded-2xl bg-background shadow-sm border-dashed">
              <HugeiconsIcon
                icon={BriefcaseIcon}
                className="size-12 mb-4 opacity-50"
              />
              <p className="text-lg font-medium">No categories available</p>
              <p className="text-sm">Check back later for new opportunities.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <Skeleton className="size-12 rounded-full" />
        </div>
      }
    >
      <CategoriesContent />
    </Suspense>
  );
}
