import { HeroSection } from "@/features/home/components/hero-section";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { JobsSection } from "@/features/home/components/jobs-section";
import { HowItWorksSection } from "@/features/home/components/how-it-works-section";
import { TopCompaniesSection } from "@/features/home/components/top-companies-section";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { query, location } = await searchParams;

  const searchQuery = typeof query === "string" ? query : undefined;
  const searchLocation = typeof location === "string" ? location : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <JobsSection query={searchQuery} location={searchLocation} />
        <HowItWorksSection />
        <TopCompaniesSection />
      </main>
    </div>
  );
}
