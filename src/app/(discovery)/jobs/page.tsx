"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Location01Icon,
  FilterIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/features/jobs/components/job-card";
import { useJobs } from "@/features/jobs/api/queries";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobFilters } from "@/features/jobs/api/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia, EmptyContent } from "@/components/ui/empty";
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
import { useAppForm } from "@/hooks/use-app-form";

function JobSearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const form = useAppForm({
    defaultValues: {
      query: searchParams.get("query") || "",
      location: searchParams.get("location") || "",
      type: searchParams.get("type") || "",
    },
    onSubmit: ({ value }) => {
      const params = new URLSearchParams(searchParams);
      if (value.query) params.set("query", value.query);
      else params.delete("query");

      if (value.location) params.set("location", value.location);
      else params.delete("location");

      if (value.type && value.type !== "all") params.set("type", value.type);
      else params.delete("type");

      // Reset to page 1 on new search
      params.set("page", "1");
      setPage(1);

      router.push(`${pathname}?${params.toString()}`);
    },
  });

  // Derive active filters from URL to trigger queries
  const filters: JobFilters = {
    query: searchParams.get("query") || undefined,
    location: searchParams.get("location") || undefined,
    type: (searchParams.get("type") as JobFilters["type"]) || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: 12,
  };

  const { data, isLoading } = useJobs(filters);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setPage(newPage);
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Search Header Banner */}
      <div className="bg-primary px-4 py-12 sm:py-16 sm:px-6 lg:px-8 border-b border-primary/20">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Find your next role
            </h1>
            <p className="mt-2 text-primary-foreground/80 text-sm sm:text-base">
              Discover opportunities that match your skills and aspirations.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="bg-background p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto"
          >
            <form.AppField name="query">
              {(field) => (
                <div className="relative flex-1 flex items-center">
                  <HugeiconsIcon icon={Search01Icon} className="absolute left-3 size-5 text-muted-foreground pointer-events-none z-10" />
                  <Input 
                    type="text" 
                    placeholder="Job title, keywords, or company" 
                    className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.AppField>
            <div className="w-px bg-border hidden sm:block" />
            <form.AppField name="location">
              {(field) => (
                <div className="relative flex-1 flex items-center">
                  <HugeiconsIcon icon={Location01Icon} className="absolute left-3 size-5 text-muted-foreground pointer-events-none z-10" />
                  <Input 
                    type="text" 
                    placeholder="City, state, zip, or Remote" 
                    className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </div>
              )}
            </form.AppField>
            <div className="w-px bg-border hidden sm:block" />
            <form.AppField name="type">
              {(field) => (
                <div className="flex items-center flex-1 sm:max-w-50 relative">
                  <HugeiconsIcon icon={FilterIcon} className="absolute ml-3 size-5 text-muted-foreground pointer-events-none z-10" />
                  <Select 
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val || "")}
                  >
                    <SelectTrigger className="pl-10 border-0 shadow-none h-12 focus:ring-0">
                      <SelectValue placeholder="All Job Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Job Types</SelectItem>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.AppField>
            <Button type="submit" size="lg" className="h-12 px-8 rounded-xl shrink-0">
              Search
            </Button>
          </form>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            {isLoading ? "Searching..." : (
              data?.pagination.total ? `${data.pagination.total} Jobs found` : "No jobs found"
            )}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-50 rounded-xl w-full" />
            ))}
          </div>
        ) : (
          <>
            {data && data.jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <Empty className="bg-background rounded-2xl">
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={Search01Icon} />
                </EmptyMedia>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyDescription>We couldn&apos;t find any jobs matching your criteria. Try adjusting your search keywords or filters.</EmptyDescription>
                <EmptyContent>
                  <Button variant="outline" className="mt-2" onClick={() => {
                    form.reset({ query: "", location: "", type: "all" });
                    router.push(pathname);
                  }}>
                    Clear Filters
                  </Button>
                </EmptyContent>
              </Empty>
            )}

            {data && data.pagination.totalPages > 1 && (
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href={page > 1 ? createPageUrl(page - 1) : "#"}
                      onClick={(e) => { e.preventDefault(); if (page > 1) handlePageChange(page - 1); }} 
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {generatePagination(page, data.pagination.totalPages).map((p, i) => (
                    <PaginationItem key={i}>
                      {p === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink 
                          href={createPageUrl(p as number)}
                          isActive={page === p}
                          onClick={(e) => { e.preventDefault(); handlePageChange(p as number); }}
                        >
                          {p}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      href={page < data.pagination.totalPages ? createPageUrl(page + 1) : "#"}
                      onClick={(e) => { e.preventDefault(); if (page < data.pagination.totalPages) handlePageChange(page + 1); }} 
                      className={page === data.pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Skeleton className="size-12 rounded-full" /></div>}>
      <JobSearchContent />
    </Suspense>
  );
}
