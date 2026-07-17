// app/page.tsx
"use client";
import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BriefcaseIcon,
  MenuIcon,
  Cancel01Icon,
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

const navLinks = [
  { label: "Find Jobs", href: "#jobs" },
  { label: "Categories", href: "#categories" },
  { label: "Companies", href: "#companies" },
  { label: "How it Works", href: "#how-it-works" },
];

const popularSearches = [
  "Product Designer",
  "Frontend Developer",
  "Data Analyst",
  "Marketing",
];

const categories = [
  { name: "Engineering", jobs: 1240, icon: CodeIcon },
  { name: "Design", jobs: 680, icon: PenToolIcon },
  { name: "Marketing", jobs: 540, icon: MegaphoneIcon },
  { name: "Finance", jobs: 420, icon: ChartBarLineIcon },
  { name: "Healthcare", jobs: 910, icon: StethoscopeIcon },
  { name: "Education", jobs: 350, icon: GraduationCapIcon },
  { name: "Real Estate", jobs: 210, icon: Building01Icon },
  { name: "Support", jobs: 470, icon: HeadphonesIcon },
];

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
  {
    title: "Customer Success Lead",
    company: "Helio",
    logo: "HL",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$80k – $100k",
    tags: ["SaaS", "CRM", "Retention"],
    posted: "6h ago",
  },
];

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

const stats = [
  { value: "50k+", label: "Active jobs" },
  { value: "12k+", label: "Companies" },
  { value: "3M+", label: "Job seekers" },
  { value: "92%", label: "Hire success" },
];

const companies = [
  { name: "Northwind Labs", logo: "NL", industry: "Technology", openings: 42 },
  { name: "Fable Studio", logo: "FS", industry: "Design", openings: 18 },
  { name: "Quanta Finance", logo: "QF", industry: "Finance", openings: 27 },
  { name: "CloudPeak", logo: "CP", industry: "Cloud", openings: 55 },
  { name: "Bloom & Co.", logo: "BC", industry: "Marketing", openings: 12 },
  { name: "Helio", logo: "HL", industry: "SaaS", openings: 31 },
];

const footerLinks = [
  {
    title: "For Candidates",
    links: [
      "Browse Jobs",
      "Browse Categories",
      "Candidate Dashboard",
      "Job Alerts",
    ],
  },
  {
    title: "For Employers",
    links: ["Post a Job", "Browse Candidates", "Employer Dashboard", "Pricing"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Blog", "Contact"],
  },
];

export default function Page() {
  const [open, setOpen] = useState(false);

  // Search states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(initialJobs);
  const [searchMessage, setSearchMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });

  const handleSearch = () => {
    // Trim and switch to lowercase for precise matching
    const queryTitle = searchTitle.trim().toLowerCase();
    const queryLocation = searchLocation.trim().toLowerCase();

    // If both fields are empty, reset to all jobs
    if (!queryTitle && !queryLocation) {
      setFilteredJobs(initialJobs);
      setSearchMessage({ type: null, text: "" });
      return;
    }

    const results = initialJobs.filter((job) => {
      const matchTitle =
        job.title.toLowerCase().includes(queryTitle) ||
        job.tags.some((tag) => tag.toLowerCase().includes(queryTitle));
      const matchLocation = job.location.toLowerCase().includes(queryLocation);

      return matchTitle && matchLocation;
    });

    if (results.length > 0) {
      setFilteredJobs(results);
      setSearchMessage({
        type: "success",
        text: `Found ${results.length} job matching your search!`,
      });

      // Auto smooth-scroll to the jobs list section
      document.getElementById("jobs")?.scrollIntoView({ behavior: "smooth" });
    } else {
      setFilteredJobs([]);
      setSearchMessage({
        type: "error",
        text: "No jobs found matching your criteria. Try adjusting your keywords or location.",
      });
    }
  };

  const resetSearch = () => {
    setSearchTitle("");
    setSearchLocation("");
    setFilteredJobs(initialJobs);
    setSearchMessage({ type: null, text: "" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Hero Section with Light Ice-Blue Gradient and Subtle Dot Grid */}
        <section
          className="relative overflow-hidden bg-gradient-to-b from-[#e0efff] via-[#f0f7ff] to-background"
          style={{
            backgroundImage: `radial-gradient(#c2deff 1px, transparent 1px), linear-gradient(to bottom, #e0efff, #f0f7ff, #ffffff)`,
            backgroundSize: "24px 24px, 100% 100%",
          }}
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
                <span className="size-2 rounded-full bg-primary" />
                Over 12,000 jobs added this week
              </span>

              <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                Find your role <span className="text-primary">reach</span> your
                goal
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Search thousands of open roles from the world&apos;s most
                exciting companies and take the next step in your career.
              </p>

              {/* Functional Search Container */}
              <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-2 rounded-xl px-3">
                  <HugeiconsIcon
                    icon={SearchIcon}
                    className="size-5 shrink-0 text-muted-foreground"
                  />
                  <Input
                    placeholder="Job title or keyword"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
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
                    className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button size="lg" className="gap-2" onClick={handleSearch}>
                  <HugeiconsIcon icon={BriefcaseIcon} className="size-4" />
                  Search
                </Button>
              </div>

              {/* Status & Feedback Messages */}
              {searchMessage.type && (
                <div className="mx-auto mt-4 flex max-w-2xl justify-center">
                  <div
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium border shadow-sm ${
                      searchMessage.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-rose-50 text-rose-800 border-rose-200"
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
                        className="size-4 text-rose-600 shrink-0"
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

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
                <span className="text-muted-foreground">Popular:</span>
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchTitle(term);
                      setSearchLocation("");
                      // Immediate search trigger logic alternative
                      const results = initialJobs.filter((job) =>
                        job.title.toLowerCase().includes(term.toLowerCase()),
                      );
                      setFilteredJobs(results);
                      setSearchMessage({
                        type: "success",
                        text: `Curated ${results.length} positions.`,
                      });
                    }}
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
            {categories.map((category) => (
              <a key={category.name} href="#jobs">
                <Card className="group flex flex-col items-start gap-4 p-6 transition-all hover:border-primary hover:shadow-md">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <HugeiconsIcon icon={category.icon} className="size-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.jobs.toLocaleString()} open jobs
                    </p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>

        {/* Featured jobs Section */}
        <section id="jobs" className="bg-[#f0f7ff] transition-all duration-300">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                  {searchMessage.type === "success"
                    ? "Search Results"
                    : "Featured jobs"}
                </h2>
                <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
                  {searchMessage.type === "success"
                    ? "Roles matching your search parameters located below."
                    : "Hand-picked roles from companies actively hiring right now."}
                </p>
              </div>
              {searchMessage.type && (
                <Button variant="outline" onClick={resetSearch}>
                  Reset view
                </Button>
              )}
            </div>

            {/* Dynamic Job Cards Display */}
            {filteredJobs.length > 0 ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.title}
                    className="transition-all hover:border-primary hover:shadow-md bg-white flex flex-col justify-between"
                  >
                    <CardContent className="flex h-full flex-col gap-4 p-6">
                      <div className="flex items-start justify-between">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-secondary-foreground">
                          {job.logo}
                        </span>
                        <button
                          className="text-muted-foreground transition-colors hover:text-primary"
                          aria-label="Save job"
                        >
                          <HugeiconsIcon
                            icon={BookmarkIcon}
                            className="size-5"
                          />
                        </button>
                      </div>

                      <div>
                        <h3 className="font-semibold leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon
                            icon={Location01Icon}
                            className="size-4"
                          />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={ClockIcon} className="size-4" />
                          {job.posted}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                        <div>
                          <p className="font-semibold text-foreground">
                            {job.salary}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {job.type}
                          </p>
                        </div>
                        <Button size="sm">Apply</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* No Results State Layout */
              <div className="mt-12 flex flex-col items-center justify-center rounded-2xl bg-white border p-12 text-center shadow-sm">
                <HugeiconsIcon
                  icon={Alert01Icon}
                  className="size-12 text-muted-foreground stroke-1 mb-4"
                />
                <h3 className="text-lg font-semibold text-foreground">
                  No matches listed
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  We couldn&apos;t find anything matching your exact text.
                  Double check spelling or try looking with empty parameters to
                  view everything.
                </p>
                <Button
                  className="mt-6"
                  variant="outline"
                  onClick={resetSearch}
                >
                  Browse All Postings
                </Button>
              </div>
            )}
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
          <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-[#f0f7ff] p-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
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
            {companies.map((company) => (
              <a key={company.name} href="#jobs">
                <Card className="group flex flex-row items-center gap-4 p-5 transition-all hover:border-primary hover:shadow-md">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-base font-bold text-secondary-foreground">
                    {company.logo}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {company.industry}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <HugeiconsIcon
                      icon={ArrowUpRightIcon}
                      className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                    />
                    <span className="mt-1 whitespace-nowrap text-xs font-medium text-primary">
                      {company.openings} jobs
                    </span>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
