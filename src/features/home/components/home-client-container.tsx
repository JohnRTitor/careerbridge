"use client";

import { useState } from "react";
import { useJobs } from "@/features/jobs/api/queries";
import { HeroSection } from "./hero-section";
import { CategoriesSection } from "./categories-section";
import { JobsSection } from "./jobs-section";
import { HowItWorksSection } from "./how-it-works-section";
import { TopCompaniesSection } from "./top-companies-section";

export function HomeClientContainer() {
  // Search states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Applied search states (to pass to useJobs)
  const [appliedSearch, setAppliedSearch] = useState<{
    query: string;
    location: string;
  } | null>(null);

  // Search Hook
  const { data: searchResultsData, isLoading: isLoadingSearch } = useJobs({
    query: appliedSearch?.query || undefined,
    location: appliedSearch?.location || undefined,
    status: "open",
    limit: 6,
    page: 1,
  });

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

  return (
    <>
      <HeroSection
        searchTitle={searchTitle}
        setSearchTitle={setSearchTitle}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        handleSearch={handleSearch}
        resetSearch={resetSearch}
        handlePopularSearch={handlePopularSearch}
        searchMessage={searchMessage}
      />
      <CategoriesSection handlePopularSearch={handlePopularSearch} />
      {/* Passing searchResultsData and isLoadingSearch down to JobsSection */}
      <JobsSection 
        appliedSearch={appliedSearch} 
        resetSearch={resetSearch} 
      />
      <HowItWorksSection />
      <TopCompaniesSection />
    </>
  );
}
