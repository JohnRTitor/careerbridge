"use client";
import Link from "next/link";
import { useState } from "react";
import {
  HugeiconsIcon,
  type IconSvgElement as IconSvgObject,
} from "@hugeicons/react";
import {
  BriefcaseIcon,
  SearchIcon,
  Location01Icon,
  ClockIcon,
  BookmarkIcon,
  CodeIcon,
  PenToolIcon,
  MegaphoneIcon,
  ChartBarLineIcon,
  StethoscopeIcon,
  GraduationCapIcon,
  Building01Icon,
  HeadphonesIcon,
  UserAdd01Icon,
  SentIcon,
  ArrowUpRightIcon,
  Alert01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

import {
  useHomepageStats,
  useJobCategories,
} from "@/features/stats/api/queries";
import { useFeaturedJobs, useJobs } from "@/features/jobs/api/queries";
import { usePopularCompanies } from "@/features/companies/api/queries";
import {
  JobCardSkeleton,
  CategoryCardSkeleton,
  CompanyCardSkeleton,
  StatSkeleton,
} from "@/components/common/skeletons";
import type { Job } from "@/features/jobs/api/types";

const popularSearches = [
  "Product Designer",
  "Frontend Developer",
  "Data Analyst",
  "Marketing",
];

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

const steps = [
  {
    icon: UserAdd01Icon,
    title: "Create your profile",
    description:
      "Sign up and build a standout profile that showcases your skills and experience.",
  },
  {
    icon: SearchIcon,
    title: "Discover matches",
    description:
      "Browse curated roles and get smart recommendations tailored to your goals.",
  },
  {
    icon: SentIcon,
    title: "Apply with ease",
    description:
      "Apply in a single click and track every application from one dashboard.",
  },
];

export default function Page() {
  // Search states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Applied search states (to pass to useJobs)
  const [appliedSearch, setAppliedSearch] = useState<{
    query: string;
    location: string;
  } | null>(null);

  // Data Hooks
  const { data: statsData, isLoading: isLoadingStats } = useHomepageStats();
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useJobCategories();
  const { data: featuredJobsData, isLoading: isLoadingFeatured } =
    useFeaturedJobs();
  const { data: popularCompaniesData, isLoading: isLoadingCompanies } =
    usePopularCompanies();

  // Search Hook
  const { data: searchResultsData, isLoading: isLoadingSearch } = useJobs({
    query: appliedSearch?.query || undefined,
    location: appliedSearch?.location || undefined,
    status: "open",
    limit: 6,
    page: 1,
  });

  // We show search results if appliedSearch is not null. Otherwise we show featured jobs.
  const isSearching = appliedSearch !== null;

  const searchMessage = (() => {
    if (isSearching && searchResultsData) {
      if (searchResultsData.jobs.length > 0) {
        return {
          type: "success" as const,
          text: `Found ${searchResultsData.pagination.total} job(s) matching your search!`,
        };
      } else {
        return {
          type: "error" as const,
          text: "No jobs found matching your criteria. Try adjusting your keywords or location.",
        };
      }
    }
    return { type: null, text: "" };
  })();

  const handleSearch = () => {
    const query = searchTitle.trim();
    const location = searchLocation.trim();

    if (!query && !location) {
      setAppliedSearch(null);
      return;
    }

    setAppliedSearch({ query, location });
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetSearch = () => {
    setSearchTitle("");
    setSearchLocation("");
    setAppliedSearch(null);
  };

  const handlePopularSearch = (term: string) => {
    setSearchTitle(term);
    setSearchLocation("");
    setAppliedSearch({ query: term, location: "" });
    document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderJobCards = (jobs: Job[], isLoading: boolean) => {
    if (isLoading) {
      return Array.from({ length: 6 }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ));
    }

    if (jobs.length === 0) {
      return null;
    }

    return jobs.map((job) => (
      <Card
        key={job.id}
        className="transition-all hover:border-primary hover:shadow-md bg-background flex flex-col justify-between"
      >
        <CardContent className="flex h-full flex-col gap-4 p-6">
          <div className="flex items-start justify-between">
            {job.company_logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={job.company_logo}
                alt={job.company_name || ""}
                className="size-12 rounded-xl object-cover border"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-secondary-foreground uppercase">
                {job.company_name?.substring(0, 2) || "CO"}
              </span>
            )}
            <button
              className="text-muted-foreground transition-colors hover:text-primary"
              aria-label="Save job"
            >
              <HugeiconsIcon icon={BookmarkIcon} className="size-5" />
            </button>
          </div>

          <div>
            <h3 className="font-semibold leading-snug line-clamp-2">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {job.company_name || "Unknown Company"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={Location01Icon} className="size-4" />
              {job.location || "Remote"}
            </span>
            <span className="flex items-center gap-1">
              <HugeiconsIcon icon={ClockIcon} className="size-4" />
              {formatDistanceToNow(new Date(job.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-auto">
            <Badge variant="secondary" className="font-normal capitalize">
              {job.type.replace("-", " ")}
            </Badge>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="font-semibold text-foreground">
                {job.salary_min && job.salary_max
                  ? `${job.currency || "$"}${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k`
                  : "Competitive"}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {job.type.replace("-", " ")}
              </p>
            </div>
            <Button size="sm">Apply</Button>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background">
          <div
            className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)`,
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
              {isLoadingStats ? (
                <div className="h-8 w-64 bg-primary/10 rounded-full animate-pulse" />
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                  <span className="size-2 rounded-full bg-primary" />
                  Over {statsData?.total_open_jobs?.toLocaleString() ||
                    "1000+"}{" "}
                  active jobs available
                </span>
              )}

              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                Find your role <span className="text-primary">reach</span> your
                goal
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Search thousands of open roles from the world&apos;s most
                exciting companies and take the next step in your career.
              </p>

              {/* Functional Search Container */}
              <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center w-full">
                <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
                  <HugeiconsIcon
                    icon={SearchIcon}
                    className="size-5 shrink-0 text-muted-foreground"
                  />
                  <Input
                    placeholder="Job title or keyword"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="border-0 bg-transparent dark:bg-transparent px-0 shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="hidden h-8 w-px bg-border sm:block" />
                <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
                  <HugeiconsIcon
                    icon={Location01Icon}
                    className="size-5 shrink-0 text-muted-foreground"
                  />
                  <Input
                    placeholder="Location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="border-0 bg-transparent dark:bg-transparent px-0 shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button size="lg" className="gap-2" onClick={handleSearch}>
                  <HugeiconsIcon icon={BriefcaseIcon} className="size-4" />
                  Search
                </Button>
              </div>

              {/* Status & Feedback Messages */}
              {searchMessage.type && (
                <div className="mx-auto mt-4 flex max-w-2xl justify-center w-full">
                  <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border shadow-sm ${
                      searchMessage.type === "success"
                        ? "bg-emerald-500/10 text-emerald-800 border-emerald-200"
                        : "bg-destructive/10 text-rose-800 border-rose-200"
                    }`}
                  >
                    {searchMessage.type === "success" ? (
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        className="size-4 text-emerald-600 shrink-0"
                      />
                    ) : (
                      <HugeiconsIcon
                        icon={Alert01Icon}
                        className="size-4 text-destructive shrink-0"
                      />
                    )}
                    <span>{searchMessage.text}</span>
                    <button
                      onClick={resetSearch}
                      className="ml-2 text-xs underline opacity-80 hover:opacity-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm w-full">
                <span className="text-muted-foreground">Popular:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handlePopularSearch(term)}
                    className="rounded-full border border-border bg-card px-3 py-1 text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section
          id="categories"
          className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Browse by category
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
              Explore opportunities across the fields you care about most.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {isLoadingCategories ? (
              Array.from({ length: 8 }).map((_, i) => (
                <CategoryCardSkeleton key={i} />
              ))
            ) : categoriesData && categoriesData.length > 0 ? (
              categoriesData.map((category) => {
                const IconComponent =
                  categoryIcons[category.industry] || BriefcaseIcon;
                return (
                  <button
                    key={category.industry}
                    onClick={() => handlePopularSearch(category.industry)}
                    className="text-left w-full cursor-pointer"
                  >
                    <Card className="group flex flex-col items-start gap-4 p-6 transition-all hover:border-primary hover:shadow-md h-full">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <HugeiconsIcon
                          icon={IconComponent}
                          className="size-6"
                        />
                      </span>
                      <div>
                        <h3 className="font-semibold">{category.industry}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.job_count.toLocaleString()} open jobs
                        </p>
                      </div>
                    </Card>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8 border rounded-2xl bg-background shadow-sm">
                No categories available yet.
              </div>
            )}
          </div>
        </section>

        {/* Jobs Section */}
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
                <Button variant="outline" onClick={resetSearch}>
                  Reset view
                </Button>
              )}
            </div>

            <div className="mt-12">
              {isSearching ? (
                // Search Results
                isLoadingSearch ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {renderJobCards([], true)}
                  </div>
                ) : searchResultsData?.jobs &&
                  searchResultsData.jobs.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {renderJobCards(searchResultsData.jobs, false)}
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
                      We couldn&apos;t find anything matching your exact text.
                      Double check spelling or try looking with empty parameters
                      to view everything.
                    </p>
                    <Button
                      className="mt-6"
                      variant="outline"
                      onClick={resetSearch}
                    >
                      Browse All Postings
                    </Button>
                  </div>
                )
              ) : // Featured Jobs
              isLoadingFeatured ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {renderJobCards([], true)}
                </div>
              ) : featuredJobsData?.jobs && featuredJobsData.jobs.length > 0 ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {renderJobCards(featuredJobsData.jobs, false)}
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
                    There are no featured jobs at the moment. Please check back
                    later or use the search above to find open positions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
              Get from search to offer in three simple steps.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                  <HugeiconsIcon icon={step.icon} className="size-7" />
                </span>
                <span className="mt-4 font-mono text-sm font-semibold text-primary">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Display Block */}
          <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-muted/30 p-8 sm:grid-cols-4">
            {isLoadingStats ? (
              Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
            ) : (
              <>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">
                    {statsData?.total_open_jobs?.toLocaleString() || "0"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Active jobs
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">
                    {statsData?.total_companies?.toLocaleString() || "0"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Companies
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">
                    {statsData?.total_users?.toLocaleString() || "0"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Job seekers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary sm:text-4xl">
                    {statsData?.total_applications?.toLocaleString() || "0"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Applications sent
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Top companies */}
        <section
          id="companies"
          className="mx-auto max-w-6xl px-4 py-20 sm:px-6"
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Top companies hiring
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
              Join teams that are shaping the future of their industries.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoadingCompanies ? (
              Array.from({ length: 6 }).map((_, i) => (
                <CompanyCardSkeleton key={i} />
              ))
            ) : popularCompaniesData?.companies &&
              popularCompaniesData.companies.length > 0 ? (
              popularCompaniesData.companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.id}`}
                  className="block"
                >
                  <Card className="group flex flex-row items-center gap-4 p-5 transition-all hover:border-primary hover:shadow-md">
                    {company.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="size-14 shrink-0 rounded-xl object-cover border"
                      />
                    ) : (
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-base font-bold text-secondary-foreground uppercase">
                        {company.name.substring(0, 2)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {company.industry || "Company"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <HugeiconsIcon
                        icon={ArrowUpRightIcon}
                        className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                      />
                      <span className="mt-1 whitespace-nowrap text-xs font-medium text-primary">
                        {company.open_jobs_count || 0} jobs
                      </span>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-8 border rounded-2xl bg-background shadow-sm">
                No companies available yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
