"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  BriefcaseIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Company } from "@/features/companies/api/types";
import { useFollowCompany, useUnfollowCompany } from "@/features/companies/api/mutations";
import { useFollowedCompanies } from "@/features/companies/api/queries";
import { usePermission } from "@/hooks/use-permission";

export function CompanyCard({ company }: { company: Company }) {
  const { can } = usePermission();
  const { data: followedCompanies = [] } = useFollowedCompanies();
  const followMutation = useFollowCompany();
  const unfollowMutation = useUnfollowCompany();

  const isFollowed = followedCompanies.some((c: Company) => c.id === company.id);
  const isCandidate = can("bookmark", "create"); // Using bookmark permissions for following for now

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFollowed) {
      await unfollowMutation.mutateAsync(company.id);
    } else {
      await followMutation.mutateAsync(company.id);
    }
  };

  const isFollowing = followMutation.isPending || unfollowMutation.isPending;

  return (
    <Card className="bg-card border border-border shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex gap-4">
            {company.logo_url ? (
              <div className="size-14 rounded-xl border border-border overflow-hidden shrink-0 bg-background">
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="size-14 rounded-xl bg-primary/10 text-primary text-xl font-bold flex items-center justify-center shrink-0 uppercase">
                {company.name.substring(0, 2)}
              </div>
            )}
            <div>
              <Link href={`/companies/${company.id}`} className="hover:underline flex items-center gap-1.5">
                <h3 className="font-semibold text-lg leading-snug line-clamp-1">
                  {company.name}
                </h3>
                {company.is_verified && (
                  <div className="text-primary bg-primary/10 rounded-full p-0.5" title="Verified Company">
                    <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
                  </div>
                )}
              </Link>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {company.description || "No description provided."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 mt-auto pt-4">
          {company.industry && (
            <Badge variant="secondary" className="font-normal bg-muted text-muted-foreground">
              <HugeiconsIcon icon={BriefcaseIcon} className="size-3 mr-1" />
              {company.industry}
            </Badge>
          )}
          {company.location && (
            <Badge variant="outline" className="font-normal text-muted-foreground border-border">
              <HugeiconsIcon icon={Location01Icon} className="size-3 mr-1" />
              <span className="truncate max-w-[120px]">{company.location}</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/50">
          <Link href={`/companies/${company.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 flex-1 bg-background" })}>
            View Profile
          </Link>
          
          {isCandidate && (
            <Button
              onClick={handleToggleFollow}
              disabled={isFollowing}
              variant={isFollowed ? "secondary" : "default"}
              size="sm"
              className="h-8 flex-1"
            >
              {isFollowed ? "Following" : "Follow"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
