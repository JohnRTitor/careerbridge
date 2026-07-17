"use client";

import { useState, useEffect, Suspense } from "react";
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
import { NativeSelect } from "@/components/ui/native-select";
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
function JobSearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // Derive active filters from URL to trigger queries
  const filters: JobFilters = {
    query: searchParams.get("query") || undefined,
    location: searchParams.get("location") || undefined,
    type: (searchParams.get("type") as JobFilters["type"]) || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: 12,
  };

  const { data, isLoading } = useJobs(filters);

  // Sync state with URL when user types/selects and hits 'Search'
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    if (query) params.set("query", query);
    else params.delete("query");
    
    if (location) params.set("location", location);
    else params.delete("location");
    
    if (type && type !== "all") params.set("type", type);
    else params.delete("type");
    
    // Reset to page 1 on new search
    params.set("page", "1");
    setPage(1);
    
    router.push(`${pathname}?${params.toString()}`);
  };

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

          <form onSubmit={handleSearch} className="bg-background p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2 max-w-4xl mx-auto">
            <div className="relative flex-1 flex items-center">
              <HugeiconsIcon icon={Search01Icon} className="absolute left-3 size-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Job title, keywords, or company" 
                className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="relative flex-1 flex items-center">
              <HugeiconsIcon icon={Location01Icon} className="absolute left-3 size-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="City, state, zip, or Remote" 
                className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0 text-base"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="flex items-center flex-1 sm:max-w-[200px]">
              <HugeiconsIcon icon={FilterIcon} className="absolute ml-3 size-5 text-muted-foreground pointer-events-none z-10" />
              <NativeSelect 
                className="pl-10 border-0 shadow-none h-12 focus-visible:ring-0"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All Job Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </NativeSelect>
            </div>
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
              <Skeleton key={i} className="h-[200px] rounded-xl w-full" />
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
              <div className="flex flex-col items-center justify-center p-12 text-center bg-background border border-dashed rounded-2xl">
                <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                  <HugeiconsIcon icon={Search01Icon} className="size-8" />
                </div>
                <h3 className="text-xl font-semibold">No results found</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  We couldn't find any jobs matching your criteria. Try adjusting your search keywords or filters.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => {
                  setQuery("");
                  setLocation("");
                  setType("all");
                  router.push(pathname);
                }}>
                  Clear Filters
                </Button>
              </div>
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
