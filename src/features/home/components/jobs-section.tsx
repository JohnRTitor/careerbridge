import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, BriefcaseIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/features/jobs/components/job-card";
import { jobsService } from "../../../../server/features/jobs/jobs.service";
import Link from "next/link";
import type { Job } from "@/features/jobs/api/types";

type JobsSectionProps = {
  query?: string;
  location?: string;
}

export async function JobsSection({ query, location }: JobsSectionProps) {
  const isSearching = !!(query || location);

  let jobs: Job[] = [];
  try {
    if (isSearching) {
      const res = await jobsService.searchJobs({
        query: query || undefined,
        location: location || undefined,
        status: "open",
        limit: 6,
        page: 1,
      });
      jobs = res.jobs as Job[];
    } else {
      const res = await jobsService.searchJobs({
        is_featured: true,
        status: "open",
        limit: 6,
        page: 1,
      });
      jobs = res.jobs as Job[];
    }
  } catch (err) {
    console.error("Failed to fetch jobs", err);
  }

  const renderJobCards = (jobs: Job[]) => {
    if (jobs.length === 0) return null;
    return jobs.map((job) => <JobCard key={job.id} job={job} />);
  };

  return (
    <section id="jobs" className="bg-muted/30 transition-all duration-300">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {isSearching ? "Search Results" : "Featured jobs"}
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
              {isSearching
                ? "Roles matching your search parameters located below."
                : "Hand-picked roles from companies actively hiring right now."}
            </p>
          </div>
          {isSearching && (
            <Button variant="outline" render={<Link href="/#jobs" scroll={false} />}>
              Reset view
            </Button>
          )}
        </div>

        <div className="mt-12">
          {isSearching ? (
            jobs.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {renderJobCards(jobs)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-background border p-12 text-center shadow-sm">
                <HugeiconsIcon
                  icon={Alert01Icon}
                  className="size-12 text-muted-foreground stroke-1 mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground">
                  No matches listed
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  We couldn&apos;t find anything matching your exact text. Double check
                  spelling or try looking with empty parameters to view everything.
                </p>
                <Button className="mt-6" variant="outline" render={<Link href="/#jobs" scroll={false} />}>
                  Browse All Postings
                </Button>
              </div>
            )
          ) : (
            jobs.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {renderJobCards(jobs)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-background border p-12 text-center shadow-sm">
                <HugeiconsIcon
                  icon={BriefcaseIcon}
                  className="size-12 text-muted-foreground stroke-1 mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground">
                  No featured jobs
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  There are no featured jobs at the moment. Please check back later or use
                  the search above to find open positions.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
