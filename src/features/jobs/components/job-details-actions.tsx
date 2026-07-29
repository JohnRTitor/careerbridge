"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookmarkIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useSavedJobs } from "@/features/jobs/api/queries";
import { useCandidateApplications } from "@/features/applications/api/queries";
import { useSaveJob, useUnsaveJob } from "@/features/jobs/api/mutations";
import { ApplyJobDialog } from "@/features/applications/components/apply-job-dialog";
import { useAppPermission } from "@/features/auth/api/queries";
import type { SavedJob } from "@/features/jobs/api/types";
import type { Application } from "@/features/applications/api/types";

interface JobDetailsActionsProps {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  status: string;
}

export function JobDetailsActions({
  jobId,
  jobTitle,
  companyName,
  status,
}: JobDetailsActionsProps) {
  const { can } = useAppPermission();
  const { data: savedJobs = [] } = useSavedJobs();
  const { data: applications = [] } = useCandidateApplications();
  
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();

  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);

  const isCandidate = can("application", "create");
  if (!isCandidate) return null;

  const isSaved = savedJobs.some((s: SavedJob) => s.id === jobId);
  const hasApplied = applications.some((a: Application) => a.job_id === jobId);
  const isSaving = saveMutation.isPending || unsaveMutation.isPending;

  const handleToggleSave = async () => {
    if (isSaved) {
      await unsaveMutation.mutateAsync(jobId);
    } else {
      await saveMutation.mutateAsync(jobId);
    }
  };

  return (
    <>
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
            disabled={status !== "open"}
          >
            Apply Now
          </Button>
        )}
      </div>

      <ApplyJobDialog 
        jobId={jobId} 
        jobTitle={jobTitle} 
        companyName={companyName || "the company"} 
        open={isApplyDialogOpen} 
        onOpenChange={setIsApplyDialogOpen} 
      />
    </>
  );
}
