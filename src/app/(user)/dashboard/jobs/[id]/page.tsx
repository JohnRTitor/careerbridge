"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { ApplicationSettings } from "@/features/jobs/components/application-settings";
import { useJob } from "@/features/jobs/api/queries";

import { Suspense } from "react";

function JobSettingsContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: job, isLoading } = useJob(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background py-12">
        <main className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <div className="h-8 w-32 bg-muted animate-pulse rounded-md mb-6" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background py-12">
        <h1 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
        <Link href="/dashboard" className="text-primary hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background py-12">
      <main className="mx-auto w-full max-w-4xl px-4 sm:px-6">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{job.title}</h1>
          <p className="text-muted-foreground mt-2">Manage settings and application form for this job.</p>
        </div>

        <ApplicationSettings jobId={job.id} />
      </main>
    </div>
  );
}

export default function JobSettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-background py-12">
        <main className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <div className="h-8 w-32 bg-muted animate-pulse rounded-md mb-6" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </main>
      </div>
    }>
      <JobSettingsContent />
    </Suspense>
  );
}
