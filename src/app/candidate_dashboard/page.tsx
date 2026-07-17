"use client";
import { useMemo } from "react";
import Link from "next/link";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/features/profiles/api/queries";
import { useCandidateApplications } from "@/features/applications/api/queries";
import { useSavedJobs } from "@/features/jobs/api/queries";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function CandidateDashboard() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: applications = [], isLoading: isAppsLoading } = useCandidateApplications();
  const { data: savedJobs = [], isLoading: isSavedJobsLoading } = useSavedJobs();

  const profileStrength = useMemo(() => {
    if (!profile) return 0;
    let score = 0;
    if (profile.headline) score += 10;
    if (profile.about) score += 10;
    if (profile.resume_url) score += 20;
    if (profile.skills && profile.skills.length > 0) score += 20;
    if (profile.experience && profile.experience.length > 0) score += 20;
    if (profile.education && profile.education.length > 0) score += 20;
    return score;
  }, [profile]);

  const activeInterviews = applications.filter(a => a.status === "interviewing").length;
  const jobOffers = applications.filter(a => a.status === "offered").length;

  const candidateStats = [
    {
      label: "Total Applications",
      value: applications.length.toString(),
      icon: BriefcaseIcon,
      color: "text-primary",
    },
    {
      label: "Interviews Slotted",
      value: activeInterviews.toString(),
      icon: CalendarIcon,
      color: "text-amber-600",
    },
    {
      label: "Job Offers",
      value: jobOffers.toString(),
      icon: Tick01Icon,
      color: "text-emerald-600",
    },
    {
      label: "Saved Openings",
      value: savedJobs.length.toString(),
      icon: BookmarkIcon,
      color: "text-indigo-600",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewing":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Reviewing</Badge>;
      case "interviewing":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Interviewing</Badge>;
      case "offered":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">Offered</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-rose-50 text-rose-700 hover:bg-rose-50">Archived</Badge>;
      default:
        return <Badge variant="secondary" className="capitalize">{status}</Badge>;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const isLoading = isProfileLoading || isAppsLoading || isSavedJobsLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8faff] p-4 sm:p-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff]">
      {/* Main Dashboard Space */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {/* Ice Blue welcome Banner */}
        <div
          className="rounded-3xl border border-primary/10 bg-linear-to-r from-[#e0efff] to-[#f0f7ff] p-6 sm:p-8 mb-8"
          style={{
            backgroundImage: `radial-gradient(#c2deff 1px, transparent 1px), linear-gradient(to right, #e0efff, #f0f7ff)`,
            backgroundSize: "24px 24px, 100% 100%",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back, {profile?.name?.split(" ")[0] || "Candidate"}! 👋
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Your profile is {profileStrength}% complete. {profileStrength < 100 ? "Complete your profile to stand out!" : "Companies are looking for you."}
              </p>
            </div>
            <Link href="/candidate_dashboard/profile" className={buttonVariants({ variant: "default", className: "gap-2 shrink-0" })}>
              <HugeiconsIcon icon={File01Icon} className="size-4" /> Update Profile
            </Link>
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
                Recent Applications
              </h2>
              <Link href="/candidate_dashboard/applications" className={buttonVariants({ variant: "outline", size: "sm", className: "bg-white" })}>
                View All ({applications.length})
              </Link>
            </div>

            {applications.slice(0, 5).map((app) => (
              <Card
                key={app.id}
                className="bg-white transition-all hover:shadow-md border border-border"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex gap-4">
                      {app.company_logo ? (
                        <div className="size-12 rounded-xl border border-border overflow-hidden shrink-0">
                          <img src={app.company_logo} alt={app.company_name || ""} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/15 text-sm font-bold text-secondary-foreground shrink-0 uppercase">
                          {app.company_name?.substring(0, 2) || "CP"}
                        </span>
                      )}
                      
                      <div>
                        <h3 className="font-semibold text-base leading-snug hover:text-primary transition-colors cursor-pointer">
                          {app.job_title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <HugeiconsIcon
                            icon={Building01Icon}
                            className="size-3.5"
                          />{" "}
                          {app.company_name || "Unknown Company"}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                          <span className="flex items-center gap-1">
                            <HugeiconsIcon
                              icon={ClockIcon}
                              className="size-3.5"
                            />{" "}
                            Applied {formatTimeAgo(app.applied_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 mt-3 sm:mt-0">
                      {getStatusBadge(app.status)}
                      <Link href={`/jobs/${app.job_id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "mt-auto bg-white text-xs h-8" })}>
                        View Job
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {applications.length === 0 && (
              <Card className="bg-white border border-dashed shadow-sm">
                <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground mb-4">
                    <HugeiconsIcon icon={BriefcaseIcon} className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold">No applications yet</h3>
                  <p className="text-muted-foreground text-sm max-w-sm mt-1">
                    When you apply for jobs, they will appear here so you can track your progress.
                  </p>
                  <Link href="/jobs" className={buttonVariants({ className: "mt-6" })}>Browse Jobs</Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right sidebar insights */}
          <div className="space-y-6">
            <Card className="bg-white border border-border overflow-hidden">
              <CardContent className="p-6 bg-linear-to-b from-[#f0f7ff] to-white">
                <div className="flex items-center justify-between text-primary font-semibold text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={TrendingUp} className="size-4" /> Profile Strength
                  </div>
                  <span>{profileStrength}%</span>
                </div>
                
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${profileStrength}%` }}
                  />
                </div>
                
                <h3 className="font-bold text-lg mt-6">
                  {profileStrength === 100 ? "All-Star Profile" : "Keep building"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {profileStrength === 100 
                    ? "Your profile is fully optimized to attract recruiters." 
                    : "Complete your profile to increase visibility to recruiters."}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <HugeiconsIcon
                    icon={BookmarkIcon}
                    className="size-4 text-indigo-500"
                  />{" "}
                  Saved Jobs
                </CardTitle>
                <Link href="/candidate_dashboard/saved-jobs" className="text-xs text-primary font-medium hover:underline">
                  View all
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedJobs.slice(0, 3).map(job => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="block group">
                    <div className="rounded-xl border border-border p-3.5 bg-slate-50/50 group-hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">{job.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {job.company_name} · {job.location}
                      </p>
                    </div>
                  </Link>
                ))}
                
                {savedJobs.length === 0 && (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    You haven't saved any jobs yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
