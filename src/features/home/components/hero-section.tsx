"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BriefcaseIcon,
  SearchIcon,
  Location01Icon,
  Alert01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useHomepageStats } from "@/features/stats/api/queries";

const popularSearches = [
  "Product Designer",
  "Frontend Developer",
  "Data Analyst",
  "Marketing",
];

interface HeroSectionProps {
  searchTitle: string;
  setSearchTitle: (value: string) => void;
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  handleSearch: () => void;
  resetSearch: () => void;
  handlePopularSearch: (term: string) => void;
  searchMessage: { type: "success" | "error" | null; text: string };
}

export function HeroSection({
  searchTitle,
  setSearchTitle,
  searchLocation,
  setSearchLocation,
  handleSearch,
  resetSearch,
  handlePopularSearch,
  searchMessage,
}: HeroSectionProps) {
  const { data: statsData, isLoading: isLoadingStats } = useHomepageStats();

  return (
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
            <Skeleton className="h-8 w-64 rounded-full" />
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <span className="size-2 rounded-full bg-primary" />
              Over {statsData?.total_open_jobs?.toLocaleString() || "1000+"} active jobs available
            </span>
          )}

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Find your role <span className="text-primary">reach</span> your goal
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Search thousands of open roles from the world&apos;s most exciting companies and take the next step in your career.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center w-full">
            <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
              <HugeiconsIcon icon={SearchIcon} className="size-5 shrink-0 text-muted-foreground" />
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
              <HugeiconsIcon icon={Location01Icon} className="size-5 shrink-0 text-muted-foreground" />
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
                  <HugeiconsIcon icon={Tick01Icon} className="size-4 text-emerald-600 shrink-0" />
                ) : (
                  <HugeiconsIcon icon={Alert01Icon} className="size-4 text-destructive shrink-0" />
                )}
                <span>{searchMessage.text}</span>
                <Button
                  variant="link"
                  onClick={resetSearch}
                  className="ml-2 h-auto p-0 text-xs underline opacity-80 hover:opacity-100 text-current hover:text-current"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm w-full">
            <span className="text-muted-foreground">Popular:</span>
            {popularSearches.map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => handlePopularSearch(term)}
                className="rounded-full h-7 px-3 text-xs transition-colors hover:border-primary hover:text-primary"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
