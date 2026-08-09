"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { BookmarkIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useSaveJob, useUnsaveJob } from "@/features/jobs/api/mutations";
import { useSavedJobs } from "@/features/jobs/api/queries";
import ClickSpark from "@/components/react-bits/ClickSpark";

type SaveJobActionProps = {
  jobId: string;
};

export function SaveJobAction({ jobId }: SaveJobActionProps) {
  const { data: savedJobs = [] } = useSavedJobs();
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();

  const isSaved = savedJobs.some((s) => s.id === jobId);
  const isSaving = saveMutation.isPending || unsaveMutation.isPending;

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      await unsaveMutation.mutateAsync(jobId);
    } else {
      await saveMutation.mutateAsync(jobId);
    }
  };

  return (
    <div className="shrink-0 flex items-center justify-center">
      <ClickSpark sparkColor="#4562FF" sparkSize={5} sparkRadius={12} sparkCount={8} duration={400}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSave}
          disabled={isSaving}
          className={`rounded-full ${
            isSaved
              ? "text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary"
              : "text-muted-foreground"
          }`}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          <HugeiconsIcon
            icon={BookmarkIcon}
            className="size-5"
            fill={isSaved ? "currentColor" : "none"}
          />
        </Button>
      </ClickSpark>
    </div>
  );
}
