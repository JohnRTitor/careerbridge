"use client";
import Image from "next/image";
import { useState } from "react";
import {
  Briefcase,
  Menu,
  X,
  Users,
  Plus,
  Clock,
  Building2,
  Calendar,
  CheckCircle2,
  UserCheck,
  MoreVertical,
  ChevronRight,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Candidate = {
  id: string;
  name: string;
  roleApplied: string;
  experience: string;
  avatarInitials: string;
  appliedTime: string;
  matchScore: string;
  status: "New" | "Shortlisted" | "Interviewing" | "Hired";
};

const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Rivera",
    roleApplied: "Senior Frontend Engineer",
    experience: "6 years exp · React, Next.js",
    avatarInitials: "AR",
    appliedTime: "3h ago",
    matchScore: "96%",
    status: "New",
  },
  {
    id: "2",
    name: "Sarah Chen",
    roleApplied: "Senior Frontend Engineer",
    experience: "8 years exp · TypeScript, Node",
    avatarInitials: "SC",
    appliedTime: "1d ago",
    matchScore: "92%",
    status: "Shortlisted",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    roleApplied: "Product Designer",
    experience: "4 years exp · Figma, Design Systems",
    avatarInitials: "MJ",
    appliedTime: "2d ago",
    matchScore: "88%",
    status: "Interviewing",
  },
  {
    id: "4",
    name: "Emily Taylor",
    roleApplied: "Marketing Manager",
    experience: "5 years exp · SEO, Growth",
    avatarInitials: "ET",
    appliedTime: "3d ago",
    matchScore: "85%",
    status: "New",
  },
];

const recruiterStats = [
  {
    label: "Active Postings",
    value: "6",
    icon: Briefcase,
    color: "text-primary",
  },
  {
    label: "Total Applicants",
    value: "184",
    icon: Users,
    color: "text-indigo-600",
  },
  {
    label: "Interviews Booked",
    value: "12",
    icon: Calendar,
    color: "text-amber-600",
  },
  {
    label: "Offers Extended",
    value: "2",
    icon: UserCheck,
    color: "text-emerald-600",
  },
];

export default function RecruiterDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  const updateStatus = (id: string, newStatus: Candidate["status"]) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)),
    );
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
          <nav className="hidden items-center gap-6 md:flex">
            <span className="text-sm font-semibold text-primary">
              Employer Dashboard
            </span>
            <a
              href="#postings"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Active Jobs
            </a>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm font-medium">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                NW
              </span>
              <span>Northwind Labs (HR)</span>
            </div>
          </div>
          <button
            className="flex size-10 items-center justify-center rounded-lg text-foreground md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {/* Ice Blue welcome Banner */}
        <div
          className="rounded-3xl border border-primary/10 bg-gradient-to-r from-[#e0efff] to-[#f0f7ff] p-6 sm:p-8 mb-8"
          style={{
            backgroundImage: `radial-gradient(#c2deff 1px, transparent 1px), linear-gradient(to right, #e0efff, #f0f7ff)`,
            backgroundSize: "24px 24px, 100% 100%",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Talent Acquisition Portal
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Review incoming pipeline talent metrics and coordinate
                structural scheduling.
              </p>
            </div>
            <Button className="gap-2 shrink-0">
              <Plus className="size-4" /> Create New Posting
            </Button>
          </div>
        </div>

        {/* Dynamic Metric Display Grids */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          {recruiterStats.map((stat) => (
            <Card
              key={stat.label}
              className="bg-white border border-border shadow-sm"
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`size-12 rounded-xl bg-[#f0f7ff] flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="size-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Applicant Tracking Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Recent Applications
              </h2>
              <div className="flex gap-1">
                <Badge className="bg-primary text-white">All Actionable</Badge>
              </div>
            </div>

            {candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="bg-white transition-all hover:shadow-md border border-border"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex gap-3.5">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shrink-0">
                        {candidate.avatarInitials}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base text-foreground">
                            {candidate.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-emerald-700 text-[10px] font-medium h-5 px-1.5 border-emerald-100"
                          >
                            {candidate.matchScore} Match
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-primary mt-0.5">
                          {candidate.roleApplied}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {candidate.experience}
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3.5" />
                        <span>{candidate.appliedTime}</span>
                      </div>

                      <div className="flex gap-1.5">
                        {candidate.status !== "Interviewing" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs bg-white"
                            onClick={() =>
                              updateStatus(candidate.id, "Interviewing")
                            }
                          >
                            Interview
                          </Button>
                        ) : (
                          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">
                            Interviewing
                          </Badge>
                        )}
                        <Button size="sm" className="h-8 text-xs">
                          Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Postings Metrics Sidebar Section */}
          <div className="space-y-6">
            <Card className="bg-white border border-border">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">
                  Active Postings Status
                </h2>
              </div>
              <CardContent className="p-0 divide-y divide-border">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer group">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      Senior Frontend Engineer
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Remote · 42 Applicants
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer group">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      Backend Engineer
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      San Francisco · 18 Applicants
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer group">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      Product Designer
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hybrid · 29 Applicants
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Sourcing Advice Block */}
            <Card className="bg-gradient-to-br from-[#f0f7ff] to-white border border-border p-5">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" /> Core
                Recruitment Tips
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Average response time drops by 40% when moving candidate to
                    interview state within 24 hours.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Automated matches are currently targeting engineering
                    profiles across US/EU locations natively.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
