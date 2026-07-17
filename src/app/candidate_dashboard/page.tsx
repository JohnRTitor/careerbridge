"use client";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BriefcaseIcon,
  ClockIcon,
  BookmarkIcon,
  Building01Icon,
  File01Icon,
  CalendarIcon,
  Tick01Icon,
  TrendingUp,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Application = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  appliedDate: string;
  status: "Reviewing" | "Interviewing" | "Offered" | "Rejected";
};

const initialApplications: Application[] = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "Northwind Labs",
    logo: "NL",
    location: "Remote · US",
    type: "Full-time",
    salary: "$130k – $160k",
    appliedDate: "Applied 2 days ago",
    status: "Interviewing",
  },
  {
    id: "2",
    title: "Product Designer",
    company: "Fable Studio",
    logo: "FS",
    location: "New York, NY",
    type: "Full-time",
    salary: "$95k – $120k",
    appliedDate: "Applied 1 week ago",
    status: "Reviewing",
  },
  {
    id: "3",
    title: "UI Engineer",
    company: "CloudPeak",
    logo: "CP",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$140k – $175k",
    appliedDate: "Applied 3 weeks ago",
    status: "Offered",
  },
];

const candidateStats = [
  {
    label: "Total Applications",
    value: "14",
    icon: BriefcaseIcon,
    color: "text-primary",
  },
  {
    label: "Interviews Slotted",
    value: "3",
    icon: CalendarIcon,
    color: "text-amber-600",
  },
  {
    label: "Job Offers",
    value: "1",
    icon: Tick01Icon,
    color: "text-emerald-600",
  },
  {
    label: "Saved Openings",
    value: "8",
    icon: BookmarkIcon,
    color: "text-indigo-600",
  },
];

export default function CandidateDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [applications] = useState<Application[]>(initialApplications);

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "Reviewing":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            Reviewing
          </Badge>
        );
      case "Interviewing":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-50 text-amber-700 hover:bg-amber-50"
          >
            Interviewing
          </Badge>
        );
      case "Offered":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
          >
            Offered
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="secondary"
            className="bg-rose-50 text-rose-700 hover:bg-rose-50"
          >
            Archived
          </Badge>
        );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff]">
      {/* Main Dashboard Space */}
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
                Welcome back, Jane! 👋
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Your profile strength is up 12% this week. Companies are looking
                for you.
              </p>
            </div>
            <Button className="gap-2 shrink-0">
              <HugeiconsIcon icon={File01Icon} className="size-4" /> Update
              Resume
            </Button>
          </div>
        </div>

        {/* Dynamic Metric Display Grids */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
          {candidateStats.map((stat) => (
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
                  <HugeiconsIcon icon={stat.icon} className="size-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Applications Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Active Applications
              </h2>
              <Badge variant="outline" className="bg-white">
                {applications.length} Ongoing
              </Badge>
            </div>

            {applications.map((app) => (
              <Card
                key={app.id}
                className="bg-white transition-all hover:shadow-md border border-border"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex gap-4">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-secondary-foreground shrink-0">
                        {app.logo}
                      </span>
                      <div>
                        <h3 className="font-semibold text-base leading-snug hover:text-primary transition-colors cursor-pointer">
                          {app.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <HugeiconsIcon
                            icon={Building01Icon}
                            className="size-3.5"
                          />{" "}
                          {app.company} · {app.location}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                          <span className="flex items-center gap-1">
                            <HugeiconsIcon
                              icon={ClockIcon}
                              className="size-3.5"
                            />{" "}
                            {app.appliedDate}
                          </span>
                          <span>•</span>
                          <span>{app.salary}</span>
                          <span>•</span>
                          <Badge
                            variant="secondary"
                            className="font-normal text-[11px] px-2 py-0"
                          >
                            {app.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0">
                      {getStatusBadge(app.status)}
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-auto bg-white text-xs h-8"
                      >
                        View Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right sidebar insights */}
          <div className="space-y-6">
            <Card className="bg-white border border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CalendarIcon}
                    className="size-4 text-primary"
                  />{" "}
                  Upcoming Interviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border p-3.5 bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">Technical Screening</h4>
                    <Badge className="bg-amber-100 text-amber-800 border-0 text-[10px]">
                      Tomorrow
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Northwind Labs · Senior Frontend
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-2">
                    10:00 AM - 11:00 AM (EST)
                  </p>
                </div>
                <div className="rounded-xl border border-border p-3.5 bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">Portfolio Review</h4>
                    <Badge variant="outline" className="text-[10px]">
                      In 4 days
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Fable Studio · Product Designer
                  </p>
                  <p className="text-xs font-semibold text-foreground mt-2">
                    02:30 PM - 03:30 PM (EST)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border overflow-hidden">
              <CardContent className="p-6 bg-gradient-to-b from-[#f0f7ff] to-white">
                <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                  <HugeiconsIcon icon={TrendingUp} className="size-4" /> Profile
                  Discovery
                </div>
                <h3 className="font-bold text-lg mt-2">
                  Appearing in Searches
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your profile was discovered by 48 tech recruiters in the past
                  7 days.
                </p>
                <div className="mt-4 pt-4 border-t border-dashed border-border flex justify-between text-center">
                  <div>
                    <p className="text-xl font-bold text-foreground">112</p>
                    <p className="text-[11px] text-muted-foreground">
                      Search Hits
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">24</p>
                    <p className="text-[11px] text-muted-foreground">
                      Profile Clicks
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">5</p>
                    <p className="text-[11px] text-muted-foreground">
                      Inquiries
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
