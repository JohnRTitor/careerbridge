"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BriefcaseIcon,
  MenuIcon,
  Cancel01Icon,
  UserGroupIcon,
  PlusSignIcon,
  ClockIcon,
  Tick01Icon,
  UserCheckIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, parseISO } from "date-fns";

import {
  useRecruiterAnalytics,
  useRecruiterJobs,
  useRecruiterApplications,
  useRecruiterProfile,
} from "@/features/recruiters/api/queries";
import { useUpdateApplicationStatus } from "@/features/recruiters/api/mutations";
import { toast } from "sonner";

export default function RecruiterDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: profile } = useRecruiterProfile();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useRecruiterAnalytics();
  const { data: jobsData, isLoading: isLoadingJobs } = useRecruiterJobs({
    limit: 5,
  });
  const { data: appsData, isLoading: isLoadingApps } = useRecruiterApplications(
    { limit: 10 },
  );
  const updateStatusMutation = useUpdateApplicationStatus();

  const handleUpdateStatus = async (
    appId: string,
    newStatus: "pending" | "reviewing" | "shortlisted" | "hired" | "rejected",
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        appId,
        data: { status: newStatus },
      });
      toast.success("Applicant status updated!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "reviewing":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shortlisted":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const totalApplicants =
    analytics?.applications_by_status.reduce(
      (acc: number, curr) => acc + parseInt(curr.count),
      0,
    ) || 0;
  const interviewingCount =
    analytics?.applications_by_status.find((s) => s.status === "reviewing")
      ?.count || 0;
  const hiredCount =
    analytics?.applications_by_status.find((s) => s.status === "hired")
      ?.count || 0;

  const recruiterStats = [
    {
      label: "Active Postings",
      value: analytics?.total_jobs || 0,
      icon: BriefcaseIcon,
      color: "text-primary",
    },
    {
      label: "Total Applicants",
      value: totalApplicants,
      icon: UserGroupIcon,
      color: "text-indigo-600",
    },
    {
      label: "In Review",
      value: interviewingCount,
      icon: ClockIcon,
      color: "text-amber-600",
    },
    {
      label: "Hired",
      value: hiredCount,
      icon: UserCheckIcon,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff]">
      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
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
                Manage your job postings and review incoming talent pipeline.
              </p>
            </div>
            <Link
              href="/recruiter_dashboard/post-job"
              className={buttonVariants({
                variant: "default",
                className: "gap-2 shrink-0",
              })}
            >
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" /> Create
              New Posting
            </Link>
          </div>
        </div>

        {isLoadingAnalytics ? (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[104px] rounded-xl" />
            ))}
          </div>
        ) : (
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
                    <HugeiconsIcon icon={stat.icon} className="size-6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Recent Applications
              </h2>
            </div>

            {isLoadingApps ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-xl w-full" />
                ))}
              </div>
            ) : appsData?.applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl border border-dashed border-border text-center">
                <p className="text-muted-foreground">No recent applications.</p>
              </div>
            ) : (
              appsData?.applications.map((app) => (
                <Card
                  key={app.id}
                  className="bg-white transition-all hover:shadow-md border border-border"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                      <div className="flex gap-3.5">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white shrink-0 uppercase">
                          {app.candidate_name?.substring(0, 2) || "NA"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base text-foreground">
                              {app.candidate_name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] font-medium h-5 px-1.5 ${getStatusColor(app.status)}`}
                            >
                              {app.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-primary mt-0.5">
                            {app.job_title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {app.candidate_headline || "No headline provided"}
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:mt-0">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <HugeiconsIcon
                            icon={ClockIcon}
                            className="size-3.5"
                          />
                          <span>
                            {formatDistanceToNow(parseISO(app.applied_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          {app.status === "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs bg-white"
                              onClick={() =>
                                handleUpdateStatus(app.id, "reviewing")
                              }
                              disabled={updateStatusMutation.isPending}
                            >
                              Review
                            </Button>
                          )}
                          {app.status === "reviewing" && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700"
                              onClick={() =>
                                handleUpdateStatus(app.id, "shortlisted")
                              }
                              disabled={updateStatusMutation.isPending}
                            >
                              Shortlist
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-white border border-border">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-bold text-foreground">
                  Active Postings
                </h2>
              </div>
              <CardContent className="p-0 divide-y divide-border">
                {isLoadingJobs ? (
                  <div className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : jobsData?.jobs.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No active jobs.
                  </div>
                ) : (
                  jobsData?.jobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {job.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {job.location} · {job.type}
                        </p>
                      </div>
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-4 text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#f0f7ff] to-white border border-border p-5">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <HugeiconsIcon
                  icon={Tick01Icon}
                  className="size-4 text-primary"
                />{" "}
                Core Recruitment Tips
              </h3>
              <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Average response time drops by 40% when moving candidate to
                    review state within 24 hours.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>
                    Keeping job descriptions concise increases conversion rates.
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
