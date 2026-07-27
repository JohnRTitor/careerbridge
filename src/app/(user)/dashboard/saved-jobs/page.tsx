"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookmarkIcon } from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedJobs } from "@/features/jobs/api/queries";
import { JobCard } from "@/features/jobs/components/job-card";

export default function SavedJobsPage() {
  const { data: savedJobs = [], isLoading } = useSavedJobs();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 space-y-6">
        <Skeleton className="h-8 w-64 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Saved Jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Jobs you&apos;ve bookmarked to review or apply for later.
          </p>
        </div>
        <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border">
          {savedJobs.length} {savedJobs.length === 1 ? "Job" : "Jobs"} Saved
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="border border-dashed rounded-xl flex-1 flex flex-col items-center justify-center p-12 text-center bg-muted/50">
          <div className="size-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
            <HugeiconsIcon icon={BookmarkIcon} className="size-8" />
          </div>
          <h3 className="text-xl font-semibold">No saved jobs</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            You haven&apos;t saved any jobs yet. When you see a job you like, click the bookmark icon to save it here.
          </p>
          <Link href="/jobs" className={buttonVariants({ className: "mt-6" })}>Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
