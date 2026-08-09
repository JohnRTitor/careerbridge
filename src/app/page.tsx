import { Suspense } from "react";
import { HeroSection } from "@/features/home/components/hero-section";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { JobsSection } from "@/features/home/components/jobs-section";
import { HowItWorksSection } from "@/features/home/components/how-it-works-section";
import { TopCompaniesSection } from "@/features/home/components/top-companies-section";

async function JobsSectionWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { query, location } = await searchParams;

  const searchQuery = typeof query === "string" ? query : undefined;
  const searchLocation = typeof location === "string" ? location : undefined;

  return <JobsSection query={searchQuery} location={searchLocation} />;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <Suspense fallback={<div className="h-64 flex items-center justify-center text-muted-foreground">Loading jobs...</div>}>
          <JobsSectionWrapper searchParams={searchParams} />
        </Suspense>
        <HowItWorksSection />
        <TopCompaniesSection />
      </main>
    </div>
  );
}
