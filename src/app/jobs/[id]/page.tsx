"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Building01Icon,
  Location01Icon,
  Wallet01Icon,
  ClockIcon,
  BriefcaseIcon,
  BookmarkIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useJob, useSavedJobs } from "@/features/jobs/api/queries";
import { useCandidateApplications } from "@/features/applications/api/queries";
import { useSaveJob, useUnsaveJob } from "@/features/jobs/api/mutations";
import { formatDistanceToNow, parseISO } from "date-fns";
import { ApplyJobDialog } from "@/features/applications/components/apply-job-dialog";
import { usePermission } from "@/hooks/use-permission";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { can } = usePermission();

  const { data: job, isLoading, error } = useJob(id);
  const { data: savedJobs = [] } = useSavedJobs();
  const { data: applications = [] } = useCandidateApplications();
  
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const isSaved = savedJobs.some((s) => s.id === id);
  const hasApplied = applications.some((a) => a.job_id === id);

  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const handleToggleSave = async () => {
    if (isSaved) {
      await unsaveMutation.mutateAsync(id);
    } else {
      await saveMutation.mutateAsync(id);
    }
  };

  const isSaving = saveMutation.isPending || unsaveMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background p-4 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
        <Skeleton className="h-8 w-24 mb-4" />
        <div className="bg-background rounded-2xl p-6 border border-border">
          <div className="flex items-start gap-6">
            <Skeleton className="size-20 rounded-xl" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold tracking-tight">Job not found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The job you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  const isCandidate = can("application", "create");

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      {/* Header Section */}
      <div className="bg-background border-b border-border py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to search
          </button>

          <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-end">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {job.company_logo ? (
                <div className="size-16 sm:size-20 rounded-2xl border border-border overflow-hidden shrink-0 bg-background shadow-sm">
                  <img src={job.company_logo} alt={job.company_name || ""} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="size-16 sm:size-20 rounded-2xl bg-primary/10 text-primary text-xl font-bold flex items-center justify-center shrink-0 uppercase border border-primary/20 shadow-sm">
                  {job.company_name?.substring(0, 2) || "CO"}
                </div>
              )}
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm sm:text-base text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium text-foreground">
                    <HugeiconsIcon icon={Building01Icon} className="size-4 text-muted-foreground" />
                    {job.company_name}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={Location01Icon} className="size-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <HugeiconsIcon icon={ClockIcon} className="size-4" />
                    Posted {formatTimeAgo(job.created_at)}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary" className="font-normal capitalize bg-muted text-muted-foreground">
                    {job.type.replace("-", " ")}
                  </Badge>
                  {(job.salary_min || job.salary_max) && (
                    <Badge variant="outline" className="font-normal border-border bg-background text-foreground">
                      <HugeiconsIcon icon={Wallet01Icon} className="size-3.5 mr-1.5 text-muted-foreground" />
                      {job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k` : ""}
                      {job.salary_min && job.salary_max ? " - " : ""}
                      {job.salary_max ? `$${(job.salary_max / 1000).toFixed(0)}k` : ""}
                    </Badge>
                  )}
                  {job.status !== "open" && (
                    <Badge variant="destructive" className="font-normal capitalize">
                      {job.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {isCandidate && (
              <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className={`flex-1 sm:flex-none h-12 px-6 shadow-sm ${isSaved ? "border-primary/50 text-primary bg-primary/5 hover:bg-primary/10" : ""}`}
                  onClick={handleToggleSave}
                  disabled={isSaving}
                >
                  <HugeiconsIcon icon={BookmarkIcon} className="size-5 mr-2" fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save Job"}
                </Button>
                
                {hasApplied ? (
                  <Button size="lg" className="flex-1 sm:flex-none h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm pointer-events-none">
                    <HugeiconsIcon icon={Tick02Icon} className="size-5 mr-2" />
                    Applied
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="flex-1 sm:flex-none h-12 px-8 shadow-sm"
                    onClick={() => setIsApplyDialogOpen(true)}
                    disabled={job.status !== "open"}
                  >
                    Apply Now
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8 w-full">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-background rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                  <HugeiconsIcon icon={BriefcaseIcon} className="size-4" />
                </div>
                Job Description
              </h2>
              <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-wrap">
                {job.description}
              </div>
            </section>

            {job.requirements && (
              <section className="bg-background rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
                <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground flex items-center gap-2">
                  <div className="p-1.5 bg-destructive/10 text-destructive rounded-lg">
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  </div>
                  Requirements
                </h2>
                <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </section>
            )}

            {job.benefits && (
              <section className="bg-background rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
                <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                    <HugeiconsIcon icon={Wallet01Icon} className="size-4" />
                  </div>
                  Benefits & Perks
                </h2>
                <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-wrap">
                  {job.benefits}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <section className="bg-background rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="text-lg font-bold tracking-tight mb-4 text-foreground">About the Company</h2>
              <div className="flex items-center gap-4 mb-4">
                {job.company_logo ? (
                  <div className="size-12 rounded-lg border border-border overflow-hidden shrink-0 bg-background">
                    <img src={job.company_logo} alt={job.company_name || ""} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="size-12 rounded-lg bg-primary/10 text-primary text-sm font-bold flex items-center justify-center shrink-0 uppercase border border-primary/20">
                    {job.company_name?.substring(0, 2) || "CO"}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-base">{job.company_name}</h3>
                  <Link href={`/companies/${job.company_id}`} className="text-sm text-primary hover:underline font-medium">
                    View Company Profile
                  </Link>
                </div>
              </div>
              {job.company_description ? (
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {job.company_description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No company description available.</p>
              )}
            </section>
          </div>
        </div>
      </div>

      {isCandidate && (
        <ApplyJobDialog 
          jobId={job.id} 
          jobTitle={job.title} 
          companyName={job.company_name || "the company"} 
          open={isApplyDialogOpen} 
          onOpenChange={setIsApplyDialogOpen} 
        />
      )}
    </div>
  );
}
