"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookmarkIcon,
  Building01Icon,
  Location01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { Job, SavedJob } from "@/features/jobs/api/types";
import { useSaveJob, useUnsaveJob } from "@/features/jobs/api/mutations";
import { useSavedJobs } from "@/features/jobs/api/queries";

export function JobCard({
  job,
}: {
  job: Job | SavedJob;
}) {
  const { data: savedJobs = [] } = useSavedJobs();
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();

  const isSaved = savedJobs.some((s) => s.id === job.id);

  const formatTimeAgo = (dateStr: string) => {
    try {
      return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSaved) {
      await unsaveMutation.mutateAsync(job.id);
    } else {
      await saveMutation.mutateAsync(job.id);
    }
  };

  const isSaving = saveMutation.isPending || unsaveMutation.isPending;

  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex gap-4">
            {job.company_logo ? (
              <div className="size-12 rounded-xl border border-border overflow-hidden shrink-0 bg-background">
                <img
                  src={job.company_logo}
                  alt={job.company_name || ""}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-bold shrink-0 uppercase">
                {job.company_name?.substring(0, 2) || "CO"}
              </span>
            )}
            <div>
              <Link href={`/jobs/${job.id}`} className="hover:underline">
                <h3 className="font-semibold text-base leading-snug line-clamp-2">
                  {job.title}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1 line-clamp-1">
                <HugeiconsIcon icon={Building01Icon} className="size-3.5 shrink-0" />
                {job.company_name}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`p-2 rounded-full hover:bg-muted transition-colors shrink-0 disabled:opacity-50 ${
              isSaved ? "text-primary bg-primary/5" : "text-muted-foreground"
            }`}
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            <HugeiconsIcon 
              icon={BookmarkIcon} 
              className="size-5" 
              fill={isSaved ? "currentColor" : "none"} 
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="font-normal capitalize bg-muted text-muted-foreground hover:bg-accent border-0">
            {job.type.replace("-", " ")}
          </Badge>
          {(job.salary_min || job.salary_max) && (
            <Badge variant="outline" className="font-normal text-muted-foreground border-border">
              <HugeiconsIcon icon={Wallet01Icon} className="size-3 mr-1" />
              {job.salary_min ? `$${(job.salary_min / 1000).toFixed(0)}k` : ""}
              {job.salary_min && job.salary_max ? " - " : ""}
              {job.salary_max ? `$${(job.salary_max / 1000).toFixed(0)}k` : ""}
            </Badge>
          )}
          <Badge variant="outline" className="font-normal text-muted-foreground border-border">
            <HugeiconsIcon icon={Location01Icon} className="size-3 mr-1" />
            <span className="truncate max-w-[100px]">{job.location}</span>
          </Badge>
        </div>

        <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Posted {formatTimeAgo(job.created_at)}
          </span>
          <Link href={`/jobs/${job.id}`} className={buttonVariants({ size: "sm", className: "h-8" })}>View Details</Link>
        </div>
      </CardContent>
    </Card>
  );
}
