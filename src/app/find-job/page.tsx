"use client";
import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BriefcaseIcon, MenuIcon, Cancel01Icon, SearchIcon, Location01Icon, ClockIcon, BookmarkIcon, Building01Icon, ArrowUpRightIcon, SparklesIcon, FilterIcon, Tick01Icon, Alert01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Campaign = {
  id: string;
  company: string;
  logo: string;
  bannerColor: string;
  title: string;
  description: string;
  openPositions: number;
  badgeText: string;
};

type Job = {
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  posted: string;
};

const activeCampaigns: Campaign[] = [
  {
    id: "camp-1",
    company: "Northwind Labs",
    logo: "NL",
    bannerColor: "from-[#1e3a8a] to-[#3b82f6]",
    title: "The Frontend Future Initiative",
    description:
      "Hiring 15+ React & Next.js specialists globally this month for core product scale.",
    openPositions: 15,
    badgeText: "Mass Hiring",
  },
  {
    id: "camp-2",
    company: "Fable Studio",
    logo: "FS",
    bannerColor: "from-[#581c87] to-[#a855f7]",
    title: "Design System Overhaul Drive",
    description:
      "Looking for visual minds to reconstruct cross-platform user experiences.",
    openPositions: 6,
    badgeText: "Urgent Talent",
  },
  {
    id: "camp-3",
    company: "CloudPeak",
    logo: "CP",
    bannerColor: "from-[#064e3b] to-[#10b981]",
    title: "Cloud Infrastructure 2026 Ramp",
    description:
      "Scaling secure cloud instances. Seeking AWS and PostgreSQL engineers.",
    openPositions: 22,
    badgeText: "High Salary Pool",
  },
];

const initialJobs: Job[] = [
  {
    title: "Senior Frontend Engineer",
    company: "Northwind Labs",
    logo: "NL",
    location: "Remote · US",
    type: "Full-time",
    salary: "$130k – $160k",
    tags: ["React", "TypeScript", "Next.js"],
    posted: "2d ago",
  },
  {
    title: "Product Designer",
    company: "Fable Studio",
    logo: "FS",
    location: "New York, NY",
    type: "Full-time",
    salary: "$95k – $120k",
    tags: ["Figma", "UI/UX", "Design Systems"],
    posted: "1d ago",
  },
  {
    title: "Data Analyst",
    company: "Quanta Finance",
    logo: "QF",
    location: "London, UK",
    type: "Hybrid",
    salary: "£55k – £70k",
    tags: ["SQL", "Python", "Tableau"],
    posted: "3d ago",
  },
  {
    title: "Marketing Manager",
    company: "Bloom & Co.",
    logo: "BC",
    location: "Remote · EU",
    type: "Full-time",
    salary: "€60k – €80k",
    tags: ["SEO", "Content", "Growth"],
    posted: "5h ago",
  },
  {
    title: "Backend Engineer",
    company: "CloudPeak",
    logo: "CP",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140k – $175k",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    posted: "4d ago",
  },
];

export default function FindJobsPage() {
  const [open, setOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);

  const [searchMessage, setSearchMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const handleSearchFilter = (typeOverride?: string) => {
    const queryTitle = searchTitle.trim().toLowerCase();
    const queryLocation = searchLocation.trim().toLowerCase();
    const typeFilter = typeOverride !== undefined ? typeOverride : selectedType;

    const results = initialJobs.filter((job) => {
      const matchTitle =
        !queryTitle ||
        job.title.toLowerCase().includes(queryTitle) ||
        job.tags.some((tag) => tag.toLowerCase().includes(queryTitle));

      const matchLocation =
        !queryLocation || job.location.toLowerCase().includes(queryLocation);
      const matchType = typeFilter === "All" || job.type === typeFilter;

      return matchTitle && matchLocation && matchType;
    });

    if (results.length > 0) {
      setFilteredJobs(results);
      setSearchMessage({
        type: "success",
        text: `Showing ${results.length} highly compatible openings.`,
      });
    } else {
      setFilteredJobs([]);
      setSearchMessage({
        type: "error",
        text: "Zero matching positions located. Try expanding criteria parameters.",
      });
    }
  };

  const resetSearch = () => {
    setSearchTitle("");
    setSearchLocation("");
    setSelectedType("All");
    setFilteredJobs(initialJobs);
    setSearchMessage({ type: null, text: "" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-1.5">
            <Image
              src="/logo.svg"
              alt="CareerBridge Logo"
              width={80}
              height={80}
              priority
              className="h-20 w-20 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">
              CareerBridge
            </span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <span className="text-sm font-semibold text-primary">
              Find Jobs
            </span>
            <a
              href="/candidate-dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost">Sign in</Button>
            <Button>Post a Job</Button>
          </div>
          <button
            className="flex size-10 items-center justify-center rounded-lg text-foreground md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <HugeiconsIcon icon={Cancel01Icon} className="size-5" /> : <HugeiconsIcon icon={MenuIcon} className="size-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Search Engine Area */}
        <section
          className="relative overflow-hidden bg-gradient-to-b from-[#e0efff] via-[#f0f7ff] to-transparent pb-12 pt-16"
          style={{
            backgroundImage: `radial-gradient(#c2deff 1px, transparent 1px), linear-gradient(to bottom, #e0efff, #f0f7ff, #f8faff)`,
            backgroundSize: "24px 24px, 100% 100%",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                {" "}
                Explore Live Openings{" "}
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
                {" "}
                Filter through targeted vacancies or connect directly with
                high-volume active corporate hiring drives.{" "}
              </p>

              {/* Functional Filtering Module */}
              <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-xl px-2">
                  <HugeiconsIcon icon={SearchIcon} className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    placeholder="Keywords or tech stack..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                  />
                </div>
                <div className="hidden h-6 w-px bg-border sm:block" />
                <div className="flex flex-1 items-center gap-2 rounded-xl px-2">
                  <HugeiconsIcon icon={Location01Icon} className="size-4 shrink-0 text-muted-foreground" />
                  <Input
                    placeholder="City or Remote..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 text-sm"
                  />
                </div>
                <Button
                  size="sm"
                  className="gap-1.5 h-10 px-4"
                  onClick={() => handleSearchFilter()}
                >
                  <HugeiconsIcon icon={FilterIcon} className="size-4" /> Filter Roles
                </Button>
              </div>

              {/* Status Message Display */}
              {searchMessage.type && (
                <div className="mx-auto mt-4 flex max-w-xl justify-center">
                  <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium border shadow-sm ${searchMessage.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-rose-50 text-rose-800 border-rose-200"}`}
                  >
                    {searchMessage.type === "success" ? (
                      <HugeiconsIcon icon={Tick01Icon} className="size-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <HugeiconsIcon icon={Alert01Icon} className="size-3.5 text-rose-600 shrink-0" />
                    )}
                    <span>{searchMessage.text}</span>
                    <button
                      onClick={resetSearch}
                      className="ml-2 underline opacity-80 hover:opacity-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dynamic Hiring Campaigns Section */}
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <HugeiconsIcon icon={SparklesIcon} className="size-4" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Featured Inbound Campaigns
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {activeCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`h-2 bg-gradient-to-r ${camp.bannerColor}`} />
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold tracking-tight text-foreground">
                        {camp.logo}
                      </span>
                      <Badge className="bg-primary/10 text-primary border-0 text-[10px] font-medium px-2 py-0.5">
                        {camp.badgeText}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm text-foreground mt-3 tracking-tight leading-snug">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {camp.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {camp.openPositions} Active Slotted Roles
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary gap-1 px-1.5 hover:bg-primary/5"
                      onClick={() => {
                        setSearchTitle(camp.company);
                        handleSearchFilter();
                      }}
                    >
                      Explore <HugeiconsIcon icon={ArrowUpRightIcon} className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filtered Core Job Boards List Layout */}
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Open Positions Base
            </h2>
            <div className="flex flex-wrap gap-1.5 bg-slate-100/80 p-1 rounded-xl border">
              {["All", "Full-time", "Hybrid"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    handleSearchFilter(type);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${selectedType === type ? "bg-white text-foreground shadow-xs border border-border" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <Card
                  key={job.title}
                  className="bg-white border border-border flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-xs"
                >
                  <CardContent className="p-5 flex h-full flex-col justify-between gap-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-xs font-bold text-secondary-foreground">
                          {job.logo}
                        </span>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                          <HugeiconsIcon icon={BookmarkIcon} className="size-4.5" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-sm leading-snug mt-3">
                        {job.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <HugeiconsIcon icon={Building01Icon} className="size-3" /> {job.company}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Location01Icon} className="size-3" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={ClockIcon} className="size-3" /> {job.posted}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {job.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="secondary"
                            className="font-normal text-[10px] px-1.5 py-0 bg-slate-50 border"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {job.salary}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {job.type}
                          </p>
                        </div>
                        <Button size="sm" className="h-8 text-xs px-3">
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-12 text-center">
              <HugeiconsIcon icon={Alert01Icon} className="size-10 text-muted-foreground stroke-1 mb-3" />
              <h3 className="text-sm font-semibold text-foreground">
                No vacancies correspond to these filters
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Try switching between types or clearing keyword tags.
              </p>
              <Button
                className="mt-4 h-8 text-xs"
                variant="outline"
                onClick={resetSearch}
              >
                Reset Layout parameters
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
