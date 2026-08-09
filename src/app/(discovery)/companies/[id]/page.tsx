import Link from "next/link";
import { notFound } from "next/navigation";
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
import { Empty, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/features/jobs/components/job-card";
import { FollowCompanyAction } from "@/features/companies/components/follow-company-action";
import { companiesService } from "@server/features/companies/companies.service";
import { jobsService } from "@server/features/jobs/jobs.service";
import type { Job } from "@/features/jobs/api/types";
import BlurText from "@/components/react-bits/BlurText";
import SplitText from "@/components/react-bits/SplitText";
import FadeContent from "@/components/react-bits/FadeContent";

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let company = null;
  let jobsData = null;

  try {
    const [companyResult, jobsResult] = await Promise.all([
      companiesService.getCompany({ companyId: id }),
      jobsService.searchJobs({ companyId: id, limit: 10, page: 1, status: "open" })
    ]);
    company = companyResult;
    jobsData = jobsResult;
  } catch (err) {
    return notFound();
  }

  if (!company) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-16">
      <div className="bg-background border-b border-border pt-8 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link 
            href="/companies"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 -ml-4 px-4 py-2 rounded-md hover:bg-muted"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to companies
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full md:w-auto">
              {company.logo_url ? (
                <div className="size-24 rounded-2xl border border-border overflow-hidden shrink-0 bg-background shadow-sm p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    <BlurText text={company.name} delay={50} />
                  </h1>
                  {company.is_verified && (
                    <div className="text-primary bg-primary/10 rounded-full p-1 mt-1" title="Verified Company">
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

            <FollowCompanyAction 
              companyId={company.id} 
              size="lg" 
              className="w-full md:w-auto h-12 px-8 shrink-0" 
              isFollowingText="Following Company"
              followText="Follow Company"
            />
          </div>
          
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-3"><SplitText text={`About ${company.name}`} delay={20} /></h2>
            <div className="prose prose-sm sm:prose-base max-w-4xl text-muted-foreground whitespace-pre-wrap">
              {company.description || "This company has not provided a description yet."}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              <SplitText text="Open Roles" delay={30} />
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Join the team at {company.name}
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
            {jobsData?.jobs.length || 0} Openings
          </Badge>
        </div>

        {jobsData && jobsData.jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobsData.jobs.map((job: Job, index: number) => (
              <FadeContent key={job.id} delay={index * 100} blur duration={800} ease="power3.out" className="h-full">
                <JobCard job={job} />
              </FadeContent>
            ))}
          </div>
        ) : (
          <Empty className="max-w-3xl mx-auto rounded-2xl">
            <EmptyMedia variant="icon">
              <HugeiconsIcon icon={BriefcaseIcon} />
            </EmptyMedia>
            <EmptyTitle>No open roles currently</EmptyTitle>
            <EmptyDescription>
              {company.name} doesn&apos;t have any open positions right now. Follow them to get notified when they post new jobs!
            </EmptyDescription>
            {/* We could potentially include FollowCompanyAction here as well, but we need to match the previous empty state logic */}
            <div className="mt-6 flex justify-center">
              <FollowCompanyAction 
                companyId={company.id}
                followText={`Follow ${company.name}`}
                isFollowingText={`Following ${company.name}`}
              />
            </div>
          </Empty>
        )}
      </div>
    </div>
  );
}
