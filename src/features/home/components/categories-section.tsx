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
  FolderOpenIcon,
} from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { getJobCategories } from "@/features/stats/api/api";
import Link from "next/link";

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

export async function CategoriesSection() {
  const categoriesData = await getJobCategories().catch(() => []);

  return (
    <section id="categories" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Browse by category
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
          Explore opportunities across the fields you care about most.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categoriesData && categoriesData.length > 0 ? (
          categoriesData.map((category) => {
            const IconComponent = categoryIcons[category.industry] || BriefcaseIcon;
            return (
              <Link
                key={category.industry}
                href={`/jobs?query=${encodeURIComponent(category.industry)}`}
                className="block text-left w-full cursor-pointer"
              >
                <Card className="group flex flex-col items-start gap-4 p-6 transition-all hover:border-primary hover:shadow-md h-full">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <HugeiconsIcon icon={IconComponent} className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{category.industry}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.job_count.toLocaleString()} open jobs
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })
        ) : (
          <Empty className="col-span-full border shadow-sm">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={FolderOpenIcon} />
              </EmptyMedia>
              <EmptyTitle>No categories available yet.</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </section>
  );
}
