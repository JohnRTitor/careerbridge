"use client";

import { useProfile } from "@/features/profiles/api/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { ProfileHeader } from "@/features/profiles/components/profile-header";
import { AboutSection } from "@/features/profiles/components/about-section";
import { ExperienceSection } from "@/features/profiles/components/experience-section";
import { EducationSection } from "@/features/profiles/components/education-section";
import { CertificationsSection } from "@/features/profiles/components/certifications-section";
import { ProjectsSection } from "@/features/profiles/components/projects-section";
import { SkillsSection } from "@/features/profiles/components/skills-section";
import { LanguagesSection } from "@/features/profiles/components/languages-section";
import { ResumesSection } from "@/features/profiles/components/resumes-section";

export default function CandidateProfilePage() {
  const { data: profile, isLoading, isError, error } = useProfile();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f8faff] p-4 sm:p-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-8 text-center">
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Failed to load profile</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          {error?.message || "An unexpected error occurred while loading your profile."}
        </p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faff]">
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="space-y-6">
          {/* Header Section */}
          <ProfileHeader profile={profile} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Main Content (Left Column) */}
            <div className="lg:col-span-2 space-y-6">
              <AboutSection profile={profile} />
              <ExperienceSection experience={profile.experience || []} />
              <EducationSection education={profile.education || []} />
              <ProjectsSection projects={profile.projects || []} />
              <CertificationsSection certifications={profile.certifications || []} />
            </div>

            {/* Sidebar (Right Column) */}
            <div className="space-y-6">
              <SkillsSection skills={profile.skills || []} />
              <LanguagesSection languages={profile.languages || []} />
              <ResumesSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
