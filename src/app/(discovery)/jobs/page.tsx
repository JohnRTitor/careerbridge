import { Suspense } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/features/jobs/components/job-card";
import FadeContent from "@/components/FadeContent";
import SplitText from "@/components/SplitText";
import DecryptedText from "@/components/DecryptedText";
import type { JobFilters } from "@/features/jobs/api/types";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { generatePagination } from "@/lib/utils";
import { jobsService } from "../../../../server/features/jobs/jobs.service";
import { JobsSearchForm } from "@/features/jobs/components/jobs-search-form";
import type { Job } from "@/features/jobs/api/types";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const filters: JobFilters = {
    query:
      typeof resolvedParams.query === "string"
        ? resolvedParams.query
        : undefined,
    location:
      typeof resolvedParams.location === "string"
        ? resolvedParams.location
        : undefined,
    type:
      typeof resolvedParams.type === "string"
        ? (resolvedParams.type as JobFilters["type"])
        : undefined,
    page:
      typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1,
    limit: 12,
    status: "open",
  };

  let data = null;
  try {
    data = await jobsService.searchJobs(filters);
  } catch (err) {
    console.error("Failed to fetch jobs", err);
  }

  const page = filters.page || 1;

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (filters.query) params.set("query", filters.query);
    if (filters.location) params.set("location", filters.location);
    if (filters.type) params.set("type", filters.type);
    params.set("page", newPage.toString());
    return `/jobs?${params.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Search Header Banner */}
      <div className="bg-primary px-4 py-12 sm:py-16 sm:px-6 lg:px-8 border-b border-primary/20">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="text-center">
            <SplitText
              text="Find your next role"
              className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
              delay={40}
              from={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
              to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            />
            <p className="mt-2 text-primary-foreground/80 text-sm sm:text-base">
              Discover opportunities that match your skills and aspirations.
            </p>
          </div>

          <JobsSearchForm />
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            {data?.pagination.total
              ? `${data.pagination.total} Jobs found`
              : "No jobs found"}
          </h2>
        </div>

        {data && data.jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.jobs.map((job: Job, index: number) => (
              <FadeContent key={job.id} delay={index * 100} blur duration={800} ease="power3.out" className="h-full">
                <JobCard job={job} />
              </FadeContent>
            ))}
          </div>
        ) : (
          <Empty className="bg-background rounded-2xl">
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={Search01Icon} />
            </EmptyMedia>
            <EmptyTitle>
              <DecryptedText text="No results found" speed={60} maxIterations={15} animateOn="view" />
            </EmptyTitle>
            <EmptyDescription>
              We couldn&apos;t find any jobs matching your criteria. Try
              adjusting your search keywords or filters.
            </EmptyDescription>
            <EmptyContent>
              <Button variant="outline" className="mt-2" render={<Link href="/jobs">Clear Filters</Link>} nativeButton={false} />
            </EmptyContent>
          </Empty>
        )}

        {data && data.pagination.totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={page > 1 ? createPageUrl(page - 1) : "#"}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {generatePagination(page, data.pagination.totalPages).map(
                (p, i) => (
                  <PaginationItem key={i}>
                    {p === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href={createPageUrl(p as number)}
                        isActive={page === p}
                      >
                        {p}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href={
                    page < data.pagination.totalPages
                      ? createPageUrl(page + 1)
                      : "#"
                  }
                  className={
                    page === data.pagination.totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
}
