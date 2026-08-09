import { Suspense } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon, SearchIcon, SentIcon } from "@hugeicons/core-free-icons";
import { getHomepageStats } from "@/features/stats/api/api";
import CountUp from "@/components/react-bits/CountUp";
import AnimatedContent from "@/components/react-bits/AnimatedContent";

const steps = [
  {
    icon: UserAdd01Icon,
    title: "Create your profile",
    description:
      "Sign up and build a standout profile that showcases your skills and experience.",
  },
  {
    icon: SearchIcon,
    title: "Discover matches",
    description:
      "Browse curated roles and get smart recommendations tailored to your goals.",
  },
  {
    icon: SentIcon,
    title: "Apply with ease",
    description:
      "Apply in a single click and track every application from one dashboard.",
  },
];

async function HowItWorksStats() {
  const statsData = await getHomepageStats().catch(() => null);

  if (!statsData) return null;

  return (
    <div className="mt-16 grid grid-cols-2 gap-6 rounded-2xl border border-border bg-muted/30 p-8 sm:grid-cols-4">
      <div className="text-center">
        <p className="text-3xl font-bold text-primary sm:text-4xl">
          <CountUp to={statsData.total_open_jobs || 0} separator="," />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Active jobs</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-primary sm:text-4xl">
          <CountUp to={statsData.total_companies || 0} separator="," />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Companies</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-primary sm:text-4xl">
          <CountUp to={statsData.total_users || 0} separator="," />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Job seekers</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-primary sm:text-4xl">
          <CountUp to={statsData.total_applications || 0} separator="," />
        </p>
        <p className="mt-1 text-sm text-muted-foreground">Applications sent</p>
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
          Get from search to offer in three simple steps.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <AnimatedContent key={step.title} distance={40} direction="vertical" duration={0.6} delay={0.15 * i}>
            <div className="relative flex flex-col items-center text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <HugeiconsIcon icon={step.icon} className="size-7" />
              </span>
              <span className="mt-4 font-mono text-sm font-semibold text-primary">
                Step {i + 1}
              </span>
              <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </AnimatedContent>
        ))}
      </div>

      {/* Stats Display Block */}
      <Suspense fallback={<div className="mt-16 h-32 flex items-center justify-center text-muted-foreground border border-border bg-muted/30 rounded-2xl">Loading stats...</div>}>
        <HowItWorksStats />
      </Suspense>
    </section>
  );
}
