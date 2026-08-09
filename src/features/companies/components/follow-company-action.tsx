"use client";

import { Button } from "@/components/ui/button";
import type { Company } from "@/features/companies/api/types";
import { useFollowCompany, useUnfollowCompany } from "@/features/companies/api/mutations";
import { useFollowedCompanies } from "@/features/companies/api/queries";
import { useAppPermission } from "@/features/auth/api/queries";
import ClickSpark from "@/components/react-bits/ClickSpark";

type FollowCompanyActionProps = {
  companyId: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  isFollowingText?: string;
  followText?: string;
};

export function FollowCompanyAction({ 
  companyId, 
  className = "h-8 flex-1", 
  size = "sm",
  isFollowingText = "Following",
  followText = "Follow"
}: FollowCompanyActionProps) {
  const { can } = useAppPermission();
  const { data: followedCompanies = [] } = useFollowedCompanies();
  const followMutation = useFollowCompany();
  const unfollowMutation = useUnfollowCompany();

  const isCandidate = can("bookmark", "create");
  if (!isCandidate) return null;

  const isFollowed = followedCompanies.some((c: Company) => c.id === companyId);
  const isFollowing = followMutation.isPending || unfollowMutation.isPending;

  const handleToggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFollowed) {
      await unfollowMutation.mutateAsync(companyId);
    } else {
      await followMutation.mutateAsync(companyId);
    }
  };

  return (
    <div className={className}>
      <ClickSpark sparkColor="#4562FF" sparkSize={6} sparkRadius={12} sparkCount={12} duration={500}>
        <Button
          onClick={handleToggleFollow}
          disabled={isFollowing}
          variant={isFollowed ? "secondary" : "default"}
          size={size}
          className="w-full h-full"
        >
          {isFollowed ? isFollowingText : followText}
        </Button>
      </ClickSpark>
    </div>
  );
}
