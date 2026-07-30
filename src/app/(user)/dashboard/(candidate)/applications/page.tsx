"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BriefcaseIcon,
  Building01Icon,
  ClockIcon,
  KanbanIcon,
  ListViewIcon,
} from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from "@/components/ui/empty";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCandidateApplications } from "@/features/applications/api/queries";
import { formatDistanceToNow, parseISO } from "date-fns";
import type { Application } from "@/features/applications/api/types";
import type { DragEndEvent } from "@/components/kibo-ui/kanban";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/kibo-ui/kanban";
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from "@/components/kibo-ui/list";

const formatTimeAgo = (dateStr: string) => {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return "recently";
  }
};

const ApplicationCardContent = ({ app }: { app: Application }) => (
  <CardContent className="p-4">
    <div className="flex gap-3">
      {app.company_logo ? (
        <div className="size-10 rounded-lg border border-border overflow-hidden shrink-0">
          <img
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
      {app.status === "draft" ? (
        <Link
          href={`/jobs/${app.job_id}/apply`}
          className={buttonVariants({
            variant: "default",
            size: "sm",
            className: "h-7 text-[10px] px-2",
          })}
        >
          Continue
        </Link>
      ) : (
        <Link
          href={`/jobs/${app.job_id}`}
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: "h-7 text-[10px] px-2 bg-background",
          })}
        >
          View Job
        </Link>
      )}
    </div>
  </CardContent>
);

const ApplicationCard = ({ app }: { app: Application }) => (
  <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
    <ApplicationCardContent app={app} />
  </Card>
);

const COLUMNS = [
  { id: "draft", name: "Drafts", color: "#6B7280" },
  { id: "pending", name: "Pending Review", color: "#8B5CF6" },
  { id: "reviewing", name: "Reviewing", color: "#3B82F6" },
  { id: "interviewing", name: "Interviewing", color: "#F59E0B" },
  { id: "offered", name: "Offered", color: "#10B981" },
  { id: "rejected", name: "Archived", color: "#EF4444" },
];

type KanbanApp = Application & {
  name: string;
  column: string;
};

export default function ApplicationsTrackerPage() {
  const { data: serverApplications = [], isLoading } = useCandidateApplications();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [localApplications, setLocalApplications] = useState<KanbanApp[]>([]);

  useEffect(() => {
    setLocalApplications(
      serverApplications.map((app) => ({
        ...app,
        name: app.job_title,
        column: app.status,
      }))
    );
  }, [serverApplications]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const status = COLUMNS.find(({ id }) => id === over.id);
    if (!status) return;

    setLocalApplications((apps) =>
      apps.map((app) => {
        if (app.id === active.id) {
          return { ...app, column: status.id, status: status.id as Application["status"] };
        }
        return app;
      })
    );
  };

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
          <Button
            variant={view === "kanban" ? "secondary" : "ghost"}
            size="sm"
            className="flex items-center gap-1.5 h-8 text-xs font-medium"
            onClick={() => setView("kanban")}
          >
            <HugeiconsIcon icon={KanbanIcon} className="size-3.5" />
            Board
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            className="flex items-center gap-1.5 h-8 text-xs font-medium"
            onClick={() => setView("list")}
          >
            <HugeiconsIcon icon={ListViewIcon} className="size-3.5" />
            List
          </Button>
        </div>
      </div>

      {localApplications.length === 0 ? (
        <Empty className="flex-1 bg-muted/50 mt-4">
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={BriefcaseIcon} />
          </EmptyMedia>
          <EmptyTitle>No applications found</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t applied to any jobs yet. Start exploring
            opportunities!
          </EmptyDescription>
          <EmptyContent>
            <Link
              href="/jobs"
              className={buttonVariants({ className: "mt-2" })}
            >
              Browse Jobs
            </Link>
          </EmptyContent>
        </Empty>
      ) : view === "kanban" ? (
        <ScrollArea className="w-full whitespace-nowrap rounded-md">
          <div className="flex w-max min-h-[600px] pb-4">
            <KanbanProvider
              columns={COLUMNS}
              data={localApplications}
              onDragEnd={handleDragEnd}
              className="flex gap-4"
            >
              {(column) => (
                <KanbanBoard id={column.id} key={column.id} className="w-[320px] shrink-0 bg-muted/50 border-border">
                  <KanbanHeader className="flex items-center justify-between p-4">
                    <span>{column.name}</span>
                    <Badge variant="secondary" className="bg-background text-foreground">
                      {localApplications.filter((app) => app.column === column.id).length}
                    </Badge>
                  </KanbanHeader>
                  <KanbanCards id={column.id} className="px-2 pb-2">
                    {(app: KanbanApp) => (
                      <KanbanCard
                        column={column.id}
                        id={app.id}
                        key={app.id}
                        name={app.name}
                        className="p-0 bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                      >
                        <ApplicationCardContent app={app} />
                      </KanbanCard>
                    )}
                  </KanbanCards>
                </KanbanBoard>
              )}
            </KanbanProvider>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="flex-1 w-full max-w-4xl mx-auto mb-8">
          <ListProvider onDragEnd={handleDragEnd}>
            <div className="flex flex-col gap-6">
              {COLUMNS.map((column) => {
                const columnApps = localApplications.filter((app) => app.column === column.id);
                if (columnApps.length === 0) return null;
                
                return (
                  <ListGroup id={column.id} key={column.id} className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                    <ListHeader color={column.color} name={column.name} className="bg-muted/50 border-b border-border" />
                    <ListItems className="p-4 gap-3">
                      {columnApps.map((app, index) => (
                        <ListItem
                          id={app.id}
                          index={index}
                          key={app.id}
                          name={app.name}
                          parent={column.id}
                          className="p-0 bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                        >
                          <ApplicationCardContent app={app} />
                        </ListItem>
                      ))}
                    </ListItems>
                  </ListGroup>
                );
              })}
            </div>
          </ListProvider>
        </div>
      )}
    </div>
  );
}
