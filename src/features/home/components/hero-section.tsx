import { statsRepository } from "../../../../server/features/stats/stats.repository";
import { HomeHeroSearch } from "./home-hero-search";
import Particles from "@/components/Particles";
import ShinyText from "@/components/ShinyText";
import BlurText from "@/components/BlurText";

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
      <div className="absolute inset-0 z-0">
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
        />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-primary/5 to-transparent pointer-events-none z-0" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
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
            Find your role <ShinyText text="reach" className="text-primary" /> your goal
          </h1>

          <BlurText
            text="Search thousands of open roles from the world's most exciting companies and take the next step in your career."
            className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground"
            delay={50}
            animateBy="words"
            direction="top"
          />

          <HomeHeroSearch />
        </div>
      </div>
    </section>
  );
}
