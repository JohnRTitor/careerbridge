import { statsRepository } from "../../../../server/features/stats/stats.repository";
import { HomeHeroSearch } from "./home-hero-search";

type HeroSectionProps = {
  searchMessage?: { type: "success" | "error" | null; text: string };
};

export async function HeroSection({ searchMessage }: HeroSectionProps) {
  let statsData = null;
  try {
    statsData = await statsRepository.getHomepageStats();
  } catch (err) {
    console.error("Failed to fetch homepage stats", err);
  }

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
          {statsData ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <span className="size-2 rounded-full bg-primary" />
              Over {statsData.total_open_jobs?.toLocaleString() || "1000+"} active jobs available
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <span className="size-2 rounded-full bg-primary" />
              Thousands of active jobs available
            </span>
          )}

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Find your role <span className="text-primary">reach</span> your goal
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Search thousands of open roles from the world&apos;s most exciting companies and take the next step in your career.
          </p>

          <HomeHeroSearch />
        </div>
      </div>
    </section>
  );
}
