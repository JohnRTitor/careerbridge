"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BriefcaseIcon,
  Building01Icon,
  ClockIcon,
  KanbanIcon,
  ListViewIcon,
} from "@hugeicons/core-free-icons";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidateApplications } from "@/features/applications/api/queries";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { Application } from "@/features/applications/api/types";

const formatTimeAgo = (dateStr: string) => {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return "recently";
  }
};

const ApplicationCard = ({ app }: { app: Application }) => (
  <Card className="bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex gap-3">
        {app.company_logo ? (
          <div className="size-10 rounded-lg border border-border overflow-hidden shrink-0">
            <Image
              src={app.company_logo}
              alt={app.company_name || ""}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-secondary-foreground shrink-0 uppercase">
            {app.company_name?.substring(0, 2) || "CP"}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-snug truncate">
            {app.job_title}
          </h4>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
            <HugeiconsIcon icon={Building01Icon} className="size-3 shrink-0" />{" "}
            {app.company_name || "Unknown Company"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <HugeiconsIcon icon={ClockIcon} className="size-3" />
          {formatTimeAgo(app.applied_at)}
        </span>
        <Link href={`/jobs/${app.job_id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "h-7 text-[10px] px-2 bg-white" })}>View Job</Link>
      </div>
    </CardContent>
  </Card>
);

const KanbanColumn = ({
  title,
  apps,
  badgeClass,
}: {
  title: string;
  apps: Application[];
  badgeClass: string;
}) => (
  <div className="flex flex-col min-w-[280px] w-full max-w-sm shrink-0 bg-slate-50/50 rounded-xl border border-border p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-sm">{title}</h3>
      <Badge variant="secondary" className={badgeClass}>
        {apps.length}
      </Badge>
    </div>
    <div className="flex flex-col gap-3 h-full">
      {apps.length > 0 ? (
        apps.map((app) => <ApplicationCard key={app.id} app={app} />)
      ) : (
        <div className="flex-1 border-2 border-dashed border-border/60 rounded-xl flex items-center justify-center text-xs text-muted-foreground p-6 text-center">
          No applications in this stage
        </div>
      )}
    </div>
  </div>
);

export default function ApplicationsTrackerPage() {
  const { data: applications = [], isLoading } = useCandidateApplications();
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const reviewing = applications.filter((a) => a.status === "reviewing");
  const interviewing = applications.filter((a) => a.status === "interviewing");
  const offered = applications.filter((a) => a.status === "offered");
  const rejected = applications.filter((a) => a.status === "rejected");

  if (isLoading) {
    return (
      <div className="p-4 sm:p-8 space-y-6">
        <Skeleton className="h-8 w-64 rounded-md" />
        <div className="flex gap-6 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96 w-72 rounded-xl shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Application Tracker
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your job applications and interview progress.
          </p>
        </div>
        <div className="flex items-center bg-muted rounded-lg p-1 border border-border shrink-0">
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === "kanban"
                ? "bg-white text-foreground shadow-xs border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView("kanban")}
          >
            <HugeiconsIcon icon={KanbanIcon} className="size-3.5" />
            Board
          </button>
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              view === "list"
                ? "bg-white text-foreground shadow-xs border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setView("list")}
          >
            <HugeiconsIcon icon={ListViewIcon} className="size-3.5" />
            List
          </button>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="border-dashed flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
          <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground mb-4">
            <HugeiconsIcon icon={BriefcaseIcon} className="size-8" />
          </div>
          <h3 className="text-xl font-semibold">No applications found</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            You haven&apos;t applied to any jobs yet. Start exploring opportunities!
          </p>
          <Link href="/jobs" className={buttonVariants({ className: "mt-6" })}>Browse Jobs</Link>
        </Card>
      ) : view === "kanban" ? (
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
          <KanbanColumn
            title="Reviewing"
            apps={reviewing}
            badgeClass="bg-blue-100 text-blue-700 hover:bg-blue-100"
          />
          <KanbanColumn
            title="Interviewing"
            apps={interviewing}
            badgeClass="bg-amber-100 text-amber-700 hover:bg-amber-100"
          />
          <KanbanColumn
            title="Offered"
            apps={offered}
            badgeClass="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
          />
          <KanbanColumn
            title="Archived"
            apps={rejected}
            badgeClass="bg-rose-100 text-rose-700 hover:bg-rose-100"
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 flex-1 content-start">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
