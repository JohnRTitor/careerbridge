"use client";

import { useParams, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Location01Icon,
  BriefcaseIcon,
  UserGroupIcon,
  GlobalIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useCompany, useFollowedCompanies } from "@/features/companies/api/queries";
import { useFollowCompany, useUnfollowCompany } from "@/features/companies/api/mutations";
import { useJobs } from "@/features/jobs/api/queries";
import { JobCard } from "@/features/jobs/components/job-card";
import { usePermission } from "@/hooks/use-permission";
import type { Company } from "@/features/companies/api/types";

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { can } = usePermission();

  const { data: company, isLoading, error } = useCompany(id);
  const { data: followedCompanies = [] } = useFollowedCompanies();
  const followMutation = useFollowCompany();
  const unfollowMutation = useUnfollowCompany();

  // Fetch open jobs for this specific company
  const { data: jobsData, isLoading: isLoadingJobs } = useJobs({ companyId: id, limit: 20, page: 1 });

  const isFollowed = followedCompanies.some((c: Company) => c.id === id);
  const isCandidate = can("bookmark", "create"); // Candidate permission proxy

  const handleToggleFollow = async () => {
    if (isFollowed) {
      await unfollowMutation.mutateAsync(id);
    } else {
      await followMutation.mutateAsync(id);
    }
  };

  const isFollowing = followMutation.isPending || unfollowMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8faff] p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        <Skeleton className="h-8 w-24 mb-4" />
        <Skeleton className="h-[250px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold tracking-tight">Company not found</h2>
        <p className="text-muted-foreground mt-2 mb-6">The company you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faff] pb-16">
      <div className="bg-white border-b border-border pt-8 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to companies
          </button>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full md:w-auto">
              {company.logo_url ? (
                <div className="size-24 rounded-2xl border border-border overflow-hidden shrink-0 bg-white shadow-sm p-2">
                  <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="size-24 rounded-2xl bg-primary/10 text-primary text-3xl font-bold flex items-center justify-center shrink-0 uppercase border border-primary/20 shadow-sm">
                  {company.name.substring(0, 2)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {company.name}
                  </h1>
                  {company.is_verified && (
                    <div className="text-blue-500 bg-blue-50 rounded-full p-1 mt-1" title="Verified Company">
                      <HugeiconsIcon icon={Tick02Icon} className="size-5" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  {company.industry && (
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <HugeiconsIcon icon={BriefcaseIcon} className="size-4 text-muted-foreground" />
                      {company.industry}
                    </span>
                  )}
                  {company.location && (
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={Location01Icon} className="size-4" />
                      {company.location}
                    </span>
                  )}
                  {company.size && (
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon icon={UserGroupIcon} className="size-4" />
                      {company.size} employees
                    </span>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                      <HugeiconsIcon icon={GlobalIcon} className="size-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {isCandidate && (
              <Button
                onClick={handleToggleFollow}
                disabled={isFollowing}
                variant={isFollowed ? "secondary" : "default"}
                size="lg"
                className="w-full md:w-auto h-12 px-8 shrink-0"
              >
                {isFollowed ? "Following Company" : "Follow Company"}
              </Button>
            )}
          </div>
          
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-3">About {company.name}</h2>
            <div className="prose prose-sm sm:prose-base max-w-4xl text-muted-foreground whitespace-pre-wrap">
              {company.description || "This company has not provided a description yet."}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Open Roles</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Join the team at {company.name}
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
            {jobsData?.jobs.length || 0} Openings
          </Badge>
        </div>

        {isLoadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
          </div>
        ) : (
          <>
            {jobsData && jobsData.jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {jobsData.jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-dashed rounded-2xl max-w-3xl mx-auto">
                <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground mb-4">
                  <HugeiconsIcon icon={BriefcaseIcon} className="size-8" />
                </div>
                <h3 className="text-xl font-semibold">No open roles currently</h3>
                <p className="text-muted-foreground mt-2">
                  {company.name} doesn't have any open positions right now. {isCandidate && !isFollowed ? "Follow them to get notified when they post new jobs!" : "Check back later for new opportunities."}
                </p>
                {isCandidate && !isFollowed && (
                  <Button onClick={handleToggleFollow} disabled={isFollowing} className="mt-6">
                    Follow {company.name}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
