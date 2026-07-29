"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BriefcaseIcon,
  SearchIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularSearches = [
  "Product Designer",
  "Frontend Developer",
  "Data Analyst",
  "Marketing",
];

export function HomeHeroSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTitle, setSearchTitle] = useState(
    searchParams.get("query") || "",
  );
  const [searchLocation, setSearchLocation] = useState(
    searchParams.get("location") || "",
  );

  const handleSearch = (query = searchTitle, location = searchLocation) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("query", query.trim());
    if (location.trim()) params.set("location", location.trim());

    router.push(`/?${params.toString()}#jobs`, { scroll: false });
  };

  return (
    <>
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
        <Button size="lg" className="gap-2" onClick={() => handleSearch()}>
          <HugeiconsIcon icon={BriefcaseIcon} className="size-4" />
          Search
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm w-full">
        <span className="text-muted-foreground">Popular:</span>
        {popularSearches.map((term) => (
          <Button
            key={term}
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTitle(term);
              setSearchLocation("");
              handleSearch(term, "");
            }}
            className="rounded-full h-7 px-3 text-xs transition-colors hover:border-primary hover:text-primary"
          >
            {term}
          </Button>
        ))}
      </div>
    </>
  );
}
