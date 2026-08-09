import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRightIcon, Building02Icon } from "@hugeicons/core-free-icons";
import { Card } from "@/components/ui/card";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { listCompanies } from "@/features/companies/api/api";
import SpotlightCard from "@/components/react-bits/SpotlightCard";
import AnimatedContent from "@/components/react-bits/AnimatedContent";

export async function TopCompaniesSection() {
  const popularCompaniesData = await listCompanies({ limit: 6, page: 1 }).catch(() => null);

  return (
    <section id="companies" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          Top companies hiring
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
          Join teams that are shaping the future of their industries.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popularCompaniesData?.companies && popularCompaniesData.companies.length > 0 ? (
          popularCompaniesData.companies.map((company, index) => (
            <Link key={company.id} href={`/companies/${company.id}`} className="block">
              <AnimatedContent
                distance={40}
                direction="vertical"
                reverse={false}
                duration={0.6}
                delay={0.1 * index}
              >
                <SpotlightCard className="group flex items-center justify-center p-6 bg-card border-border hover:border-primary hover:shadow-md h-[100px]" spotlightColor="rgba(69, 98, 255, 0.15)">
                  {company.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={company.logo_url}
                      alt={company.name}
                      className="size-14 shrink-0 rounded-xl object-cover border"
                    />
                  ) : (
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-base font-bold text-secondary-foreground uppercase">
                      {company.name.substring(0, 2)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground group-hover:text-primary transition-colors">{company.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {company.industry || "Company"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <HugeiconsIcon
                      icon={ArrowUpRightIcon}
                      className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                    />
                    <span className="mt-1 whitespace-nowrap text-xs font-medium text-primary">
                      {company.open_jobs_count || 0} jobs
                    </span>
                  </div>
                </SpotlightCard>
              </AnimatedContent>
            </Link>
          ))
        ) : (
          <Empty className="col-span-full border shadow-sm">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HugeiconsIcon icon={Building02Icon} />
              </EmptyMedia>
              <EmptyTitle>No companies available yet.</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </section>
  );
}
